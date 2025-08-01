// Ce fichier est un middleware d'authentification pour Express.js
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

// Fonction pour tester si l'utilisateur est authentifié,
// ou connecté tout au long de la navigation sur le site
// On le fait en checkant le token JWT dans les cookies

module.exports.authMiddleware = (req, res, next) => {
    const token = req.cookies.jwt; // On récupère le token JWT depuis les cookies

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null; // Si le token n'est pas valide, on ne définit pas l'utilisateur
                res.cookie('jwt', '', { maxAge: 1 }); // On supprime le cookie JWT
                next(); // On passe au middleware suivant
            }
            else {
                console.log("Decoded token:", decodedToken);
                let user = await UserModel.findById(decodedToken.id); // On cherche l'utilisateur dans la base de données
                res.locals.user = user; // On définit l'utilisateur dans les variables locales de la réponse
                console.log("User found:", user);
                next(); // On passe au middleware suivant
            }
        })

    } else {
        res.locals.user = null; // Si pas de token, on ne définit pas l'utilisateur
        next(); // On passe au middleware suivant
    }

};


module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt; // On récupère le token JWT depuis les cookies

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                console.log("Authentication error : ", err);
                return res.status(401).json({ message: "Authentication error" });
            } else {
                let user = await UserModel.findById(decodedToken.id);
                console.log("Decoded token:", decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        console.log("No token found, authentication required");
        return res.status(401).json({ message: "No token found, authentication required" });
    }
}