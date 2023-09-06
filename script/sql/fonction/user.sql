-- Function for insert a user
CREATE OR REPLACE FUNCTION web.insert_user(u json) RETURNS TABLE (id int, firstname text, lastname text, mail text) AS $$

    INSERT INTO administration.user
    (firstname, lastname, mail, password)
    VALUES
    (
        u->>'firstname',
        u->>'lastname',
        u->>'mail',
        u->>'password'
    )
    RETURNING id, firstname, lastname, mail;
    $$ LANGUAGE sql SECURITY DEFINER;

-- Function for delete a user
CREATE OR REPLACE FUNCTION web.delete_user(id_user int) RETURNS boolean AS $$
DECLARE
    id_selected int;
    temprow record;
BEGIN
    SELECT id INTO id_selected
    FROM administration.user
    WHERE id = id_user;

    IF FOUND THEN
        FOR temprow IN
        SELECT id 
        FROM web.booking
        WHERE user_id = id_selected
            LOOP        
                PERFORM web.delete_booking(temprow.id,id_selected);
            END LOOP;

        DELETE FROM administration.user
        WHERE id = id_selected;
        RETURN true;
    ELSE
        RETURN false;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- function which returns a user by his id with his reservation
CREATE OR REPLACE FUNCTION web.get_one_user(userID int)
RETURNS TABLE (id int, firstname text, lastname text , mail text, reservation json[]) AS $$
    SELECT administration.user.id, 
        administration.user.firstname, 
        administration.user.lastname, 
        administration.user.mail 
	, ARRAY( SELECT json_build_object(
    -- Departure / Comeback
        'departure_date',web.departure.departure_date,
        'comeback_date',web.comeback.comeback_date,
    -- Planet
        'planet_img',web.planet.img,
        'planet_name',web.planet.name,
        'planet_price',web.planet.price,
    -- Hostel
        'hostel_name',web.hostel.name,
    -- Room
        'room_rank',web.room.rank,
        'room_price',web.room.price,
    -- Spaceship
        'spaceship_name', web.spaceship.name,
    -- Booking
        'booking_id',web.booking.id,
        'booking_nbparticipants',web.booking.nbparticipants,
        'booking_total_price',web.booking.total_price)
	FROM administration.user									
    LEFT JOIN web.booking ON administration.user.id = web.booking.user_id
    LEFT JOIN web.departure ON web.departure.id = web.booking.departure_id
    LEFT JOIN web.comeback ON web.comeback.id = web.booking.comeback_id
    LEFT JOIN web.planet ON web.planet.id = web.departure.planet_id
    LEFT JOIN web.hostel ON web.hostel.id = web.booking.hostel_id
    LEFT JOIN web.room ON web.room.id = web.booking.room_id
    LEFT JOIN web.spaceship ON web.spaceship.id = web.departure.spaceship_id
    WHERE administration.user.id = userID
        )
FROM administration.user
WHERE administration.user.id = userID
$$ LANGUAGE sql SECURITY DEFINER;

-- Function for update a user
CREATE OR REPLACE FUNCTION web.update_user(u json) RETURNS administration.user AS $$
DECLARE
    user_db administration.user;
BEGIN
    
    SELECT id, firstname, lastname, mail
    INTO user_db
    FROM administration.user WHERE id=(u->>'id')::int;
	
	IF NOT FOUND THEN
        -- Handle the case where the user record does not exist
        RAISE EXCEPTION 'User with ID % not found', (u->>'id')::int;
    END IF;

    IF u->>'firstname' IS NOT NULL
    THEN 
    user_db.firstname = u->>'firstname';
    END IF;

    IF u->>'lastname' IS NOT NULL
    THEN 
    user_db.lastname = u->>'lastname';
    END IF;

    IF u->>'mail' IS NOT NULL
    THEN 
    user_db.mail = u->>'mail';
    END IF;

    UPDATE administration.user
    SET firstname = user_db.firstname, lastname = user_db.lastname, mail = user_db.mail
    WHERE id = (u->> 'id')::int;

    RETURN user_db;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION web.check_user(u json) RETURNS administration.user AS $$
	SELECT *
	FROM administration.user
	WHERE mail=u->>'mail';

$$ LANGUAGE sql SECURITY DEFINER;