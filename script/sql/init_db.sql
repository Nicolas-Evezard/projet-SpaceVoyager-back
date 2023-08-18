-- je crèe le rôle "admin_space" qui a tous les droits
CREATE ROLE admin_space WITH LOGIN PASSWORD 'space';

-- je crèe le rôle "member_space" qui sera le compte utilisé par notre solution NodeJS pour se connecter à la bdd
CREATE ROLE member_space WITH LOGIN PASSWORD 'earth';

-- création des groupes
CREATE ROLE space_group_web;
CREATE ROLE space_group_administration;

-- ajout dans les groupes
GRANT space_group_web TO member_space;
GRANT space_group_web TO admin_space;

GRANT space_group_administration TO admin_space;

-- je crèe la BDD "spacevoyager"
CREATE DATABASE spacevoyager OWNER admin_space;