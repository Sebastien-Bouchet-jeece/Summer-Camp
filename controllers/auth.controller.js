// fichier pour gérer l'authentification : inscription, connexion, déconnexion

const UserModel = require('../models/user.model'); // on importe le modèle User
const jwt = require('jsonwebtoken'); // on importe le module jsonwebtoken pour créer des tokens
const maxAge = 3 * 24 * 60 * 60 * 1000; // Durée de validité du token en millisecondes (3 jours)
const { signUpErrors } = require('../utils/errors.utils');
const { signInErrors } = require('../utils/errors.utils'); // on importe les fonctions pour gérer les erreurs de connexion et d'inscription

// inscription

// permet d'exporter la fonction signUp qui sera utilisée dans les routes
// req (request) : ce qui est envoyé par le client (données, headers, etc.)
// res (response) : ce qui est renvoyé par le serveur (statut, données, etc.)
// async : permet d'utiliser await à l'intérieur de la fonction
module.exports.signUp = async (req, res) => {
    console.log("signUp called with data:", req.body); // pour vérifier les données envoyées par le client
    const { username, email, password } = req.body; // on récupère les données envoyées par le client

    try {
        // Vérification si l'utilisateur existe déjà
        const user = await UserModel.create({username, email, password});
        res.status(201).json({user: user._id, message: "User created successfully"});
    } 
    catch (err) {
        const error = signUpErrors(err); // on appelle la fonction signUpErrors pour traiter les erreurs
        // Si une erreur se produit, on renvoie un message d'erreur
        res.status(500).json({message: "Error creating user ", error});
    }
}


// connexion

const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: maxAge }); // on crée un token avec l'ID de l'utilisateur et une durée de validité de 3 jours
}

module.exports.signIn = async (req, res) => {
    const { email, password } = req.body; // on récupère les données envoyées par le client

    try {
        // on vérifie dans la BDD si l'utilisateur existe avec le req.body.email et req.body.password
        const user = await UserModel.login(email, password);
        const token = createToken(user._id); // on crée un token avec l'ID de l'utilisateur
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge }); // on envoie le token dans un cookie
        res.status(200).json({ user: user._id, token }); // on renvoie l'ID de l'utilisateur et le token
        // A ENLEVER LE TOKEN APRES ^|
    }
    catch (err) {
        const error = signInErrors(err); // on appelle la fonction signInErrors pour traiter les erreurs
        // Si une erreur se produit, on renvoie un message d'erreur
        res.status(400).json({message: "Error signing in", error});
    }
}


// déconnexion

module.exports.logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 }); // On supprime le cookie en le définissant avec une date d'expiration dans le passé
    //res.redirect('/'); // On redirige l'utilisateur vers la page d'accueil ou une autre page de votre choix
    res.status(200).json({ message: "Logout successful" });
}
