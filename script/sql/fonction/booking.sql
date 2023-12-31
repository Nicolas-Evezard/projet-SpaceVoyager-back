-- I create a function that will allow me to check the availability of round-trip flights to the planets on the specified dates for the number of people provided
CREATE OR REPLACE FUNCTION web.search_available_planet(person int, date_dp date, date_cb date) RETURNS SETOF web.planet AS $$
SELECT *
    FROM web.planet
     WHERE id IN (
        -- Sous-requête pour sélectionner les ID de planète disponibles
        SELECT planet.id
        FROM web.planet
        -- I perform a left join of the table that lists fully booked return flights on a given date by summing up the number of passengers requested by the user
        LEFT JOIN (
            SELECT planet_id
            FROM web.comeback
            JOIN web.spaceship ON spaceship.id = comeback.spaceship_id
            WHERE comeback_date = date_cb AND reserved_place + person > spaceship.max_place
        ) AS comeback_subquery
        ON planet.id = comeback_subquery.planet_id
        -- I perform a left join on the table that lists fully booked outbound flights on a given date by summing up the number of passengers requested by the user
        LEFT JOIN (
            SELECT planet_id
            FROM web.departure
            JOIN web.spaceship ON spaceship.id = departure.spaceship_id
            WHERE departure_date = date_dp AND reserved_place + person > spaceship.max_place
        ) AS departure_subquery
        ON planet.id = departure_subquery.planet_id
        -- I select only those for which the left join returns null because if it's null, it means the planet has no fully booked flights (no data in the right tables of the left join)
        WHERE comeback_subquery.planet_id IS NULL AND departure_subquery.planet_id IS NULL)
        -- Add a condition to find only the planets where there is availability in at least one hotel/room, meaning their name is in my subquery
        AND planet.name IN (
        --  Common Table Expressions (CTEs) qui répertorie les rooms complets sur les dates    
        WITH result_calendar AS (
                        SELECT planet.name, room_id
                        -- Subquery of all fully booked dates per room, with the number of participants per date/room being distinct
                        FROM (
                            SELECT generate_series(web.departure.departure_date, web.comeback.comeback_date, '1 day'::interval) AS interval, web.booking.nbparticipants, web.booking.room_id, web.booking.hostel_id
                            FROM web.booking
                            JOIN web.departure ON web.booking.departure_id = web.departure.id
                            JOIN web.comeback ON web.booking.comeback_id = web.comeback.id
                            ORDER BY interval
                        ) as booking_calendar
                        JOIN web.hostel ON hostel.id = booking_calendar.hostel_id
                        JOIN web.planet ON planet.id = hostel.planet_id
						JOIN web.room ON hostel.id = room.hostel_id
                        WHERE interval BETWEEN date_dp AND date_cb
                        GROUP bY interval, room_id, planet.name, booking_calendar.hostel_id, room.max_place
                        -- We sum up the people who share the same room on the same date
                        HAVING SUM(booking_calendar.nbparticipants)+ person > room.max_place
                        ORDER BY interval, room_id, planet.name, booking_calendar.hostel_id),
        -- In the table that lists all rooms and hostels, we perform a left join with the previous table, and if a value is null, it means the room is available
		compare_calendar AS(
            SELECT web.planet.name, web.room.id FROM web.planet
            JOIN web.hostel ON web.hostel.planet_id = web.planet.id
            JOIN web.room ON web.room.hostel_id = web.hostel.id)
            SELECT compare_calendar.name
            FROM compare_calendar
            LEFT JOIN result_calendar ON compare_calendar.name = result_calendar.name AND compare_calendar.id = result_calendar.room_id
            WHERE result_calendar.name IS NULL
    )
$$ LANGUAGE sql SECURITY DEFINER;

-- I create a function that will allow me to verify the validity of a reservation in the final step
CREATE OR REPLACE FUNCTION web.available_lastcheck(person int, date_dp date, date_cb date, id_room int, id_planet int) RETURNS SETOF web.planet AS $$
SELECT *
  FROM web.planet
  WHERE id = id_planet
    AND NOT EXISTS (
        -- Subquery to check room availability
		SELECT 1 FROM generate_series(date_dp, date_cb, interval '1 day') AS interval
                WHERE EXISTS (
                    SELECT 1
                    FROM web.booking
                    JOIN web.departure ON web.booking.departure_id = web.departure.id
    				JOIN web.comeback ON web.booking.comeback_id = web.comeback.id
    				JOIN web.room ON web.booking.room_id = web.room.id
    				JOIN web.hostel ON web.room.hostel_id = web.hostel.id
                    WHERE interval BETWEEN departure.departure_date AND comeback.comeback_date
                        AND hostel.planet_id = 3
                        AND booking.room_id = 1
                    GROUP BY booking.room_id, room.max_place
                    HAVING SUM(booking.nbparticipants) + person > room.max_place)
    )
    AND NOT EXISTS (
      -- Subquery to check fully booked return flights
      SELECT 1
      FROM web.comeback
      JOIN web.spaceship ON web.comeback.spaceship_id = web.spaceship.id
      WHERE web.comeback.comeback_date = date_cb
        AND web.comeback.reserved_place + person > web.spaceship.max_place
        AND web.comeback.planet_id = id_planet
    )
    AND NOT EXISTS (
      -- Subquery to check fully booked outbound flights
      SELECT 1
      FROM web.departure
      JOIN web.spaceship ON web.departure.spaceship_id = web.spaceship.id
      WHERE web.departure.departure_date = date_dp
        AND web.departure.reserved_place + person > web.spaceship.max_place
        AND web.departure.planet_id = id_planet
    );
$$ LANGUAGE sql SECURITY DEFINER;	

-- I create a function that allows me to delete a reservation
CREATE OR REPLACE FUNCTION web.delete_booking(id_booking int, id_user int) RETURNS boolean AS $$
DECLARE 
    departure_db_id integer;
    comeback_db_id integer;
    person integer;
	delete_result int;
BEGIN
    SELECT departure_id, comeback_id, nbparticipants
    INTO departure_db_id, comeback_db_id, person
    FROM web.booking
    WHERE id = id_booking AND user_id = id_user;
    
    IF FOUND THEN
        UPDATE web.departure
        SET reserved_place = reserved_place - person
        WHERE id = departure_db_id;

        UPDATE web.comeback
        SET reserved_place = reserved_place - person
        WHERE id = comeback_db_id;

        DELETE FROM web.booking WHERE id = id_booking
        RETURNING id INTO delete_result;
        IF delete_result is null
        THEN
        RETURN false;
        ELSE
        RETURN true;
        END IF;
    ELSE
        RETURN false;
    END IF;        
END; 
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- I create a function that allows me to create a reservation
CREATE OR REPLACE FUNCTION web.insert_booking(b json) RETURNS web.booking AS $$
DECLARE 
    comeback_db_id integer;
    departure_db_id integer;
    spaceship_db_id integer;
    creating_booking web.booking;
BEGIN

    SELECT id
    INTO spaceship_db_id
    FROM web.spaceship WHERE name ='Le SpaceVoyager 2';

    SELECT id
    INTO departure_db_id
    FROM web.departure WHERE planet_id=(b->>'planet_id')::int AND departure_date=(b->>'dp_date')::date;

    -- If the ID is null, then I insert a row into the 'departure' table where 'departure_date' = 'cd_date' and 'planet_id' = 'planet_id'
    IF departure_db_id is null
    THEN 
        INSERT INTO web.departure
        (departure_date, reserved_place, spaceship_id, planet_id)
        VALUES 
        (
            (b->>'dp_date')::date,
            (b->>'person')::int,
            spaceship_db_id,
            (b->>'planet_id')::int
        )
        RETURNING id INTO departure_db_id;
    ELSE
        UPDATE web.departure
        SET reserved_place = reserved_place + (b->>'person')::int
        WHERE id = departure_db_id;
    END IF;    

    SELECT id
    INTO comeback_db_id
    FROM web.comeback WHERE planet_id=(b->>'planet_id')::int AND comeback_date=(b->>'cb_date')::date;

    -- If the ID is null, then I insert a row into the 'comeback' table where 'comeback_date' = 'cd_date' and 'planet_id' = 'planet_id'
    IF comeback_db_id is null
    THEN 
        INSERT INTO web.comeback
        (comeback_date, reserved_place, spaceship_id, planet_id)
        VALUES 
        (
            (b->>'cb_date')::date,
            (b->>'person')::int,
            spaceship_db_id,
            (b->>'planet_id')::int
        )
        RETURNING id INTO comeback_db_id;
    ELSE
        UPDATE web.comeback
        SET reserved_place = reserved_place + (b->>'person')::int
        WHERE id = comeback_db_id;    
    END IF;
    
	INSERT INTO web.booking
	(nbparticipants,total_price,hostel_id,room_id,departure_id, comeback_id, user_id)
	VALUES
	(
		(b->> 'person')::int,
		(b->> 'total_price')::int,
		(b->>'hostel_id')::int,
        (b->>'room_id')::int,
        departure_db_id,
        comeback_db_id,
        (b->>'user_id')::int
	)
    RETURNING * INTO creating_booking;
	-- I return the inserted row
	RETURN creating_booking;
END; 

$$ LANGUAGE plpgsql SECURITY DEFINER;

-- I create a function that allows me to check hotel availability for the provided dates and number of people
CREATE OR REPLACE FUNCTION web.search_available_hostel(person int, date_dp date, date_cb date, planet_name text) RETURNS TABLE(id int, name text, content text, adress text, img text, planet_id int, room json[]) AS $$
SELECT * FROM
(SELECT 
        hostel.*,
        ARRAY (
            SELECT json_build_object('id', room.id, 'room_type', room.rank, 'price', room.price)
            FROM web.room
            WHERE room.hostel_id = hostel.id
            AND NOT EXISTS (
                SELECT 1
                FROM generate_series(date_dp, date_cb, interval '1 day') AS interval
                WHERE EXISTS (
                    SELECT 1
                    FROM web.booking
                    JOIN web.departure ON booking.departure_id = departure.id
                    JOIN web.comeback ON booking.comeback_id = comeback.id
                    WHERE interval BETWEEN departure.departure_date AND comeback.comeback_date
                        AND hostel.planet_id = (SELECT id FROM web.planet WHERE name = planet_name)
                        AND booking.room_id = room.id
                    GROUP BY booking.room_id
                    HAVING SUM(booking.nbparticipants) + person > room.max_place
                )
            )
        ) AS room
    FROM web.hostel
    WHERE hostel.planet_id = (SELECT id FROM web.planet WHERE name = planet_name)) as subquery
WHERE array_length(subquery.room, 1)>0;
$$ LANGUAGE sql SECURITY DEFINER;  
