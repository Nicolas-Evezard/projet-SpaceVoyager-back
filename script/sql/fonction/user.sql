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