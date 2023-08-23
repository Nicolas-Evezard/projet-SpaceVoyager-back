CREATE OR REPLACE FUNCTION web.search_available_planet(person int, date_dp date, date_cb date) RETURNS SETOF web.planet AS $$
SELECT *
    FROM web.planet
     WHERE id IN (
        -- Sous-requête pour sélectionner les ID de planète disponibles
        SELECT planet.id
        FROM web.planet
        -- je fais un left join de la table qui répertorie les vols retour qui sont complets sur une date donnés en aditionnant le nombre de personne demandé par l'utilisateur
        LEFT JOIN (
            SELECT planet_id
            FROM web.comeback
            JOIN web.spaceship ON spaceship.id = comeback.spaceship_id
            WHERE comeback_date = date_cb AND reserved_place + person > spaceship.max_place
        ) AS comeback_subquery
        ON planet.id = comeback_subquery.planet_id
        -- je fais un left join de la table qui répertorie les vols aller qui sont complets sur une date donnés en aditionnant le nombre de personne demandé par l'utilisateur
        LEFT JOIN (
            SELECT planet_id
            FROM web.departure
            JOIN web.spaceship ON spaceship.id = departure.spaceship_id
            WHERE departure_date = date_dp AND reserved_place + person > spaceship.max_place
        ) AS departure_subquery
        ON planet.id = departure_subquery.planet_id
        -- je selectionne seulement ceux dont le left join renvoi null, car si c'est null c'est que la planet n'a pas de vol complet (pas de donnés dans les tables de droite du left join)
        WHERE comeback_subquery.planet_id IS NULL AND departure_subquery.planet_id IS NULL)
        -- je rajoute une condition pour trouver seulement les planet dont il y a de la place dans au moins un hotel/room, donc où le nom est dans ma subquerie
        AND planet.name IN (
        --  Common Table Expressions (CTEs) qui répertorie les rooms complets sur les dates    
        WITH result_calendar AS (
                        SELECT planet.name, room_id
                        -- sous requête de toutes les dates complètes par chambre, avec le nombre de participant par date/chambre distinct
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
                        -- on fait la somme des personnes qui ont la même chanbre à la même date
                        HAVING SUM(booking_calendar.nbparticipants)+ person > room.max_place
                        ORDER BY interval, room_id, planet.name, booking_calendar.hostel_id),
        -- tableau qui répertorie toutes les chambres et hostel, on le leftjoin avec le tableau précédent, si une valeur est null alors c'est que la chambre est disponible
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

CREATE OR REPLACE FUNCTION web.search_available_hostel(person int, date_dp date, date_cb date, planet_name text) RETURNS TABLE(id int, name text, content text, adress text, img text, planet_id int, room json[]) AS $$
SELECT hostel.*,
ARRAY(
	SELECT json_build_object('id',room.id,'room_type',room.rank,'price', room.price)
	FROM web.room
	WHERE room.hostel_id = hostel.id
	AND room.id IN (
		WITH result_calendar AS (
                        SELECT planet.name, room_id
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
                        HAVING SUM(booking_calendar.nbparticipants)+ person > room.max_place
                        ORDER BY interval, room_id, planet.name, booking_calendar.hostel_id),

		compare_calendar AS(
            SELECT web.planet.name, web.room.id FROM web.planet
            JOIN web.hostel ON web.hostel.planet_id = web.planet.id
            JOIN web.room ON web.room.hostel_id = web.hostel.id)
            SELECT compare_calendar.id
            FROM compare_calendar
            LEFT JOIN result_calendar ON compare_calendar.name = result_calendar.name AND compare_calendar.id = result_calendar.room_id
            WHERE result_calendar.name IS NULL
		)
	GROUP BY room.rank, room.price, room.id) as room
FROM web.hostel
WHERE planet_id = (SELECT id FROM web.planet WHERE name = planet_name)
$$ LANGUAGE sql SECURITY DEFINER;
