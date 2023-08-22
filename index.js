/**************************/
/* Paramétrage du serveur */
/**************************/

// import des informations du fichier .env
require("dotenv").config();

// récupération de mon app Express
const app = require("./app");

// récupération du PORT configuré
const PORT = process.env.PORT ?? 3000;

// mise sur écoute de notre app sur le port
app.listen(PORT, () => {
  console.log(`Serveur accessible sur http://localhost:${PORT}`);
});
