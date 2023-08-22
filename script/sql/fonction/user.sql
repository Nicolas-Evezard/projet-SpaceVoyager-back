CREATE FUNCTION web.insert_user(u json) RETURNS administration.user AS $$
    INSERT INTO administration.user
    (firstname, lastname, mail, password, role)
    VALUES
    (
        u->>'firstname',
        u->>'lastname',
        u->>'mail',
        u->>'password',
        u->>'role'
    )

    -- Je retourne la ligne insérée
    RETURNING *;

    $$ LANGUAGE sql SECURITY DEFINER;