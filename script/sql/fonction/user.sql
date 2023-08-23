-- this function returns a user by his id and his reservations
CREATE OR REPLACE FUNCTION web.get_one_user(userID int)
RETURNS TABLE (id int, firstname text, lastname text , mail text, password text, role text, reservation json[]) AS $$
    -- Selectionne les champs de la table user et un champ sous forme de tableau, contenant des objets json
    SELECT administration.user.*, ARRAY( SELECT json_build_object(
    -- User
        'user_firstname', administration.user.firstname,
        'user_lastname', administration.user.lastname,
        'user_mail', administration.user.mail,
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
        'booking_nbparticipants',web.booking.nbparticipants,
        'booking_total_price',web.booking.total_price))
FROM administration.user
    JOIN web.booking ON administration.user.id = web.booking.user_id
    JOIN web.departure ON web.departure.id = web.booking.departure_id
    JOIN web.comeback ON web.comeback.id = web.booking.comeback_id
    JOIN web.planet ON web.planet.id = web.departure.planet_id
    JOIN web.hostel ON web.hostel.id = web.booking.hostel_id
    JOIN web.room ON web.room.id = web.booking.room_id
    JOIN web.spaceship ON web.spaceship.id = web.departure.spaceship_id
-- Filtre en fonction du user_id
WHERE administration.user.id = userID
$$ LANGUAGE sql SECURITY DEFINER;