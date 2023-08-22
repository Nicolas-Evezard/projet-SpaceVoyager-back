CREATE FUNCTION web.search_available_planet(person int, date_dp date, date_cb date) RETURNS SETOF web.planet AS $$
SELECT *
    FROM web.planet
     WHERE id IN (
        -- Sous-requête pour sélectionner les ID de planète disponibles
        SELECT planet.id
        FROM web.planet
        LEFT JOIN (
            SELECT planet_id
            FROM web.comeback
            JOIN web.spaceship ON spaceship.id = comeback.spaceship_id
            WHERE comeback_date = date_cb AND reserved_place + person <= spaceship.max_place
        ) AS comeback_subquery
        ON planet.id = comeback_subquery.planet_id
        LEFT JOIN (
            SELECT planet_id
            FROM web.departure
            JOIN web.spaceship ON spaceship.id = departure.spaceship_id
            WHERE departure_date = date_dp AND reserved_place + person <= spaceship.max_place
        ) AS departure_subquery
        ON planet.id = departure_subquery.planet_id
        WHERE comeback_subquery.planet_id IS NULL AND departure_subquery.planet_id IS NULL)
        AND planet.name IN (
        WITH result_calendar AS (SELECT planet.name, room_id
                        FROM (
                            SELECT generate_series(web.departure.departure_date, web.comeback.comeback_date, '1 day'::interval) AS interval, web.booking.nbparticipants, web.booking.room_id, web.booking.hostel_id
                            FROM web.booking
                            JOIN web.departure ON web.booking.departure_id = web.departure.id
                            JOIN web.comeback ON web.booking.comeback_id = web.comeback.id
                            ORDER BY interval
                        ) as booking_calendar
                        JOIN web.hostel ON hostel.id = booking_calendar.hostel_id
                        JOIN web.planet ON planet.id = hostel.planet_id
                        WHERE interval BETWEEN date_dp AND date_cb
                        GROUP by interval, room_id, planet.name, booking_calendar.hostel_id
                        -- 1 etant le nombre de participant indiqué par le user
                        HAVING SUM(booking_calendar.nbparticipants)+ person >= 5
                        ORDER BY interval, room_id, planet.name, booking_calendar.hostel_id),

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
