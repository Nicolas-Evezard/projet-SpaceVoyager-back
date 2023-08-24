const client = require("../service/dbPool");
const debug = require("debug")("model"); // ("model") est le namespace utilisé dans ce fichier
const APIError = require("../service/APIError");


const userDatamapper = {

    async addOne(user) {
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
    },

    async deleteOne() {
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
    },

    async modify(userInfo){
        const sqlQuery = `
        SELECT * FROM web.update_user($1)
        `
        const values = [userInfo];
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
    },

    async checkUser(user) {
      // je prépare ma requête SQL
      const sqlQuery = `
          SELECT * FROM web.check_user($1);
      `;
      const values = [user];

      let result;
      let error;

      try {
          // j'envoie ma requête à ma BDD
          const response = await client.query(sqlQuery,values);

          // je place la réponse dans result
          result = response.rows[0];
          console.log(result)
        
          debug(result);
      }
      catch (err) {
          debug(err);
          // je crèe une erreur 500
          error = new APIError("Erreur interne au serveur", 500);
      }

      // je retourne le résultat et l'erreur éventuelle
      return { error, result };
  },
};

module.exports = userDatamapper;
