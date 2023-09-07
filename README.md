<p align="center" width="100%">
  <img src="https://i.ibb.co/nQQcP00/39.png" />
</p>
<br>

# Space Voyager

## Objectif

L'objectif principal de ce projet est de développer une plateforme en ligne où les utilisateurs pourront planifier, réserver et vivre des voyages spatiaux vers des destinations extraterrestres. L'accent est mis sur l'expérience utilisateur, la simplicité de la réservation et la visualisation immersive des destinations.

## Fonctionnalités

### Version 1 (V1) :

- **Inscription / Connexion** : Les utilisateurs doivent s'inscrire et se connecter pour réserver un voyage. Ils peuvent gérer leur profil, le mettre à jour ou supprimer des informations.
- **Planification de Voyage** : Les utilisateurs peuvent choisir une destination (planète), un hébergement (hôtel), une chambre et une navette. Les choix sont limités pour simuler une expérience de réservation réaliste.
- **Validation de la Commande** : Les utilisateurs peuvent consulter, modifier et valider leur panier.
- **Visualisation** : Les utilisateurs peuvent voir un aperçu détaillé de leur voyage à la fin du processus de réservation. Les conditions météorologiques prévues pour la destination seront également affichées.

### Version 2 (V2) :

- **Commentaires / Notes** : Les utilisateurs peuvent laisser des commentaires et des notes sur les voyages et les hôtels, ce qui ajoute une dimension sociale à l'expérience.
- **Multilinguisme** : Le site sera disponible en plusieurs langues, y compris le klingon pour une expérience plus immersive.
- **Backoffice** : Mise en place d'un panneau d'administration pour accéder aux statistiques et aux données des voyages. Cela permettra de suivre les performances du site et de prendre des décisions éclairées.

## Technologies Utilisées

- **Base de données** : Psql avec Datamapper
- **Backend** : Node.js avec Express.js
- **Authentification** : JWT (json web token) avec passport.js
- **Sécurité** : (À considérer) helmet
- **Frontend** : React avec Sass
- **Intégration d'API** : Utilisation d'API de la Nasa pour des informations sur les planètes
- **Visualisation 3D** : ThreeJS pour la modélisation des planètes et des hôtels en 3D, vue 360 de l'hôtel
- **Intelligence Artificielle** : Midjourney, Skybox AI

## Équipe

Ce projet a été co-construit et réfléchi en collaboration avec les membres suivants :

- Nicolas.C
- Nicolas.E
- Tarek
- Réda
- Jade

L'expertise de cette équipe couvre le développement web, la conception d'expérience utilisateur, la gestion de bases de données, l'intégration d'API et plus encore, ce qui la rend bien adaptée à la réalisation réussie de ce projet ambitieux.

N'hésitez pas à contacter l'équipe pour toute question ou suggestion concernant le projet. Nous sommes impatients de rendre possible l'exploration spatiale pour tous !

# Initialisation

Ce README explique comment cloner, exécuter des scripts et lancer le projet **Space Voyager**.

Ce projet est configuré en **Postgresql** et **Nodejs**, veillez donc à les avoir installés au préalable.

## Clonage du Référentiel

Pour obtenir une copie de ce projet sur votre ordinateur, suivez ces étapes :

1. Ouvrez votre terminal.
2. Utilisez la commande `git clone` suivie de l'URL du référentiel :

```bash
git clone git@github.com:O-Clock-Webb/projet-02-spaceVoyager-back.git
```

## Installation des dépendances

Assurez-vous d'avoir les dépendances requises installées. Vous pouvez généralement trouver des informations sur les dépendances dans le fichier package.json, le cas échéant.

Afin d'installer les dépendances nécessaires au fonctionnement du projet, veuillez lancer la commande d'installation suivante :

```bash
npm install
```

## Exécution de Scripts

Le projet peut inclure différents scripts que vous pouvez exécuter :

3. Exécutez le script à l'aide des commandes suivantes :

Initialisation de la base de données :

```bash
bash script/init.sh
```

Initialisation des tables dans la base de données :

```bash
bash script/init_function.sh
```

# Lancement du Projet

Afin de lancer le projet, dans le terminal, exécutez la commande suivante :

En mode devellopement :

```bash
npm run dev
```

En mode actif :

```bash
npm start
```

# Documentation

La documentation de l'API est disponible via swagger sur l'adresse `localhost:3000/docs`

# Contribuer

Si vous souhaitez contribuer à ce projet, merci de contacter les auteurs.

# Licence

Ce projet est sous licence MIT
