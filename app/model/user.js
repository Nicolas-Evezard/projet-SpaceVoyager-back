const client = require("../service/dbPool");
const debug = require("debug")("model"); // ("model") est le namespace utilisé dans ce fichier
const APIError = require("../service/APIError");

const userDatamapper = {

    async delete() {
        const sqlQuery = `SELECT * FROM web.delete_user($1);`;
        const values = [id];
        let result;
        let error;
    
        try {
          const response = await client.query(sqlQuery, values);
    
          // je teste pour savoir si au moins une ligne a été retournée
          //! ATTENTION GESTION D'ERREUR EN BOOLEAN A REVOIR
          if (response.rows == false) {
            // aucun user n'a été trouvé
            error = new APIError("Aucun user n'a été trouvée", 404);
          } else {
            // je place la réponse dans result
            result = true;
          }
        } catch (err) {
          // je crèe une erreur 500
          error = new APIError("Erreur interne au serveur", 500, err);
        }
    
        // je retourne le résultat et l'erreur éventuelle
        return { error, result };
      },
};

module.exports = userDatamapper;
