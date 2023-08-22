-- this function returns a user by his id
CREATE FUNCTION web.get_one_user(user_id int) RETURNS administration.user AS $$
    SELECT * FROM administration.user WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER;