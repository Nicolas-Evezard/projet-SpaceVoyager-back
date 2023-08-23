CREATE OR REPLACE FUNCTION web.delete_user(u json) RETURNS boolean AS $$
DECLARE
    user_id bigint;
BEGIN
    SELECT id INTO user_id
    FROM administration.user
    WHERE id = u->>'user_id' AND password = u->>'password';

    IF FOUND THEN
        DELETE FROM administration.user
        WHERE id = user_id;
        RETURN true;
    ELSE
        RETURN false;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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



-- fonction qui met à jour un utilisateur
CREATE OR REPLACE FUNCTION web.update_user(u json) RETURNS administration.user AS $$
DECLARE
    user_db administration.user;
BEGIN
    -- je récupère un user en BDD par son id
    SELECT * 
    INTO user_db
    FROM administration.user WHERE id=(u->>'id')::int;

    IF u->>'firstname' IS NOT NULL
    THEN 
    user_db.firstname = u->>'firstname'
    END IF;

     IF u->>'lastname' IS NOT NULL
    THEN 
    user_db.lastname = u->>'lastname'
    END IF;

    IF u->>'mail' IS NOT NULL
    THEN 
    user_db.mail = u->>'mail'
    END IF;


    UPDATE administration.user
    SET firstname = user_db.firstname, lastname = user_db.lastname, mail = user_db.mail
    WHERE id = (u->> 'id')::int;

    -- plpgsql nous oblige à utiliser le mot RETURN pour retourner la valeur
    RETURN user_db;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;;