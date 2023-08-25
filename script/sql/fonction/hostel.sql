-- Function for get all hostel
CREATE OR REPLACE FUNCTION web.get_all_hostel() RETURNS SETOF web.hostel AS $$
    SELECT * FROM web.hostel;
$$ LANGUAGE sql SECURITY DEFINER;

-- Function for get hostel by id
CREATE OR REPLACE FUNCTION web.get_hostel(hostel_id int) RETURNS web.hostel AS $$
    SELECT * FROM web.hostel WHERE id = hostel_id;
$$ LANGUAGE sql SECURITY DEFINER;