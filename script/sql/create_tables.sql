BEGIN;

-- CREATION DE SCHEMAS web et administration pour anticiper la prochaine version du projet qui implémentera un utilisateur administrateur

-- je positionne mon groupe " space_group_administration" comme propriétaire des schémas
CREATE SCHEMA web
    AUTHORIZATION space_group_administration;

CREATE SCHEMA administration
    AUTHORIZATION space_group_administration;

-- je donne le droit d'USAGE au groupe "space_group_web"
-- ce doit d'USAGE au niveau des fonctions de mon schéma, va me permettre de les appeler
GRANT USAGE ON SCHEMA web TO space_group_web;

-- je positionne le droit d'exécuter des fonctions au groupe "space_group_web" au niveau du schéma "web"
ALTER DEFAULT PRIVILEGES FOR ROLE admin_space IN SCHEMA web
GRANT EXECUTE ON FUNCTIONS TO space_group_web; 

-- table qui contient les planetes
CREATE TABLE web.planet (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL UNIQUE,
    distance bigint NOT NULL,
    distance_light_year bigint NOT NULL,
    content text NOT NULL,
    radius int NOT NULL,
    temp_min int NOT NULL,
    temp_max int NOT NULL,
    img text,
    price int NOT NULL
);

-- table qui contient les hotels
CREATE TABLE web.hostel (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL UNIQUE,
    content text,
    adress text NOT NULL UNIQUE,
    img text,
    planet_id int NOT NULL REFERENCES web.planet(id)
);

-- table qui contient les chambres
CREATE TABLE web.room (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    content text,
    price int NOT NULL,
    max_place int NOT NULL,
    rank text NOT NULL,
    hostel_id int NOT NULL REFERENCES web.hostel(id)
);

-- table qui contient les starship
CREATE TABLE web.spaceship (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL,
    max_place int NOT NULL,
    content text NOT NULL
);

-- table qui contient les vols aller
CREATE TABLE web.departure (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    departure_date DATE NOT NULL,
    reserved_place INT NOT NULL,
    spaceship_id int NOT NULL REFERENCES web.spaceship(id),
    planet_id int NOT NULL REFERENCES web.planet(id)

);

-- table qui contient les vols retour
CREATE TABLE web.comeback (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    comeback_date DATE NOT NULL,
    reserved_place INT NOT NULL,
    spaceship_id int NOT NULL REFERENCES web.spaceship(id),
    planet_id int NOT NULL REFERENCES web.planet(id)
); 

-- table pour gérer les utilisateurs de mon application web
CREATE TABLE administration.user (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    firstname text NOT NULL,
    lastname text NOT NULL,
    mail text NOT NULL UNIQUE,
    password text NOT NULL,
    role text NOT NULL DEFAULT 'member'
);

-- table qui contient les réservations
CREATE TABLE web.booking (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nbparticipants int NOT NULL,
    total_price int NOT NULL,
    hostel_id int NOT NULL REFERENCES web.hostel(id),
    room_id int NOT NULL REFERENCES web.room(id),
    departure_id int NOT NULL REFERENCES web.departure(id),
    comeback_id int NOT NULL REFERENCES web.comeback(id),
    user_id int NOT NULL REFERENCES administration.user(id),
    created_at timestamptz DEFAULT current_timestamp

);

COMMIT;