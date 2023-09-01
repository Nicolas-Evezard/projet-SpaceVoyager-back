-- Function for get all planets
CREATE OR REPLACE FUNCTION web.get_all_planets() RETURNS SETOF web.planet AS $$
	SELECT * FROM web.planet;
$$ LANGUAGE sql SECURITY DEFINER;

-- Function for get one planet
CREATE OR REPLACE FUNCTION web.get_planet(planet_id int) RETURNS web.planet AS $$
    SELECT * FROM web.planet WHERE id = planet_id;
$$ LANGUAGE sql SECURITY DEFINER;