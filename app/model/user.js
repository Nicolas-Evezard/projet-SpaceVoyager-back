const client = require("../service/dbPool");
const debug = require("debug")("model"); // ("model") est le namespace utilisé dans ce fichier
const APIError = require("../service/APIError");

const userDatamapper = {
    async getOne(userId) {
        // I prepare my request SQL
        const sqlQuery = `
        SELECT * FROM web.get_one_user($1)
        `
        // I put values in an array to use the parametrylized request system
        const values = [userId];
        let result;
        let error;
        try {
            const response = await client.query(sqlQuery, values);

            result = response.rows;

            debug(result)
        }
        catch (err) {
            debug(err);

            // I create a new error 500
            error = new APIError("Internal error server", 500);
        }
        // I return the result of the potential error
        return { error, result };
    }

};

module.exports = userDatamapper;
