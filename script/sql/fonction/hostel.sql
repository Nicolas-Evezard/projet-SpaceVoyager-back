-- fonction qui retourne les hotels
CREATE OR REPLACE FUNCTION web.get_all_hostel() RETURNS SETOF web.hostel AS $$
    SELECT * FROM web.hostel;
$$ LANGUAGE sql SECURITY DEFINER;

-- fonction qui retourne un hotel par son id
CREATE FUNCTION web.get_hostel(hostel_id int) RETURNS web.hostel AS $$
    SELECT * FROM web.hostel WHERE id = hostel_id;
$$ LANGUAGE sql SECURITY DEFINER;