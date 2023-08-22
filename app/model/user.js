const client = require("../service/dbPool");
const debug = require("debug")("model"); // ("model") est le namespace utilisé dans ce fichier
const APIError = require("../service/APIError");

const userDatamapper = {

    async addUser(user) {
        const sqlQuery = `
        SELECT * FROM web.insert_user($1)
        `;
        const values = [user];
        console.log(user);
        let result;
        let error;
        try {
            // j'envoie ma requête à ma BDD
            const response = await client.query(sqlQuery,values);
            // je place la réponse dans la variable result
            result = response.rows;
            debug(result);
        }
        catch (err) {
            debug(err);
            // je crée une erreur 500
            error = new APIError("Erreur interne au serveur", 500);
        }

        // je retourne le résultat et l'erreur éventuelle
        return { error, result };

    }

};

module.exports = userDatamapper;
