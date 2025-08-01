// Ce fichier contient les fonctions pour gérer les utilisateurs
//const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

// Récupérer tous les utilisateurs
module.exports.getAllUsers = async (req, res) => {
    // On cherche la table qui correspond à UserModel, select() pour prendre tout
    const users = await UserModel.find().select('-password -__v'); // On ne renvoie pas le mot de passe et la version (__v)
    // On renvoie les utilisateurs
    res.status(200).json(users);
}


// Nouvelle fonction pour récupérer les infos d'un seul utilisateur
// module.exports <=> nouvelle fonction
module.exports.userInfo = async (req, res) => {
    console.log(req.params.id);
    // On vérifie si l'ID est valide
    if (!ObjectID.isValid(req.params.id)) { // Vérifie s'il n'est pas valide
        return res.status(400).send('ID unknown : ' + req.params.id);
    }

    // On utilise try/catch pour gérer les erreurs
    try {
        // On cherche l'utilisateur par son ID
        const user = await UserModel.findById(req.params.id).select('-password -__v');
        // Si l'utilisateur n'existe pas, on renvoie une erreur 404, sinon, on renvoie l'utilisateur
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (err) {
        console.log('ID unknown : ' + err);
        res.status(500).send('Server error');
    }
}


// Nouvelle fonction pour mettre à jour un utilisateur
module.exports.updateUser = async (req, res) => {
    // On vérifie si l'ID est valide
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID unknown : ' + req.params.id);
    }

    // On utilise try/catch pour gérer les erreurs
    try {
        // On met à jour l'utilisateur par son ID
        const user = await UserModel.findOneAndUpdate(
            { _id: req.params.id },
            
            { $set: // Qu'est-ce qu'on modifie ? Met à jour avec les données du corps de la requête
                { bio : req.body.bio }
            }, 

            { new: true, upsert: true, setDefaultsOnInsert: true } // new : renvoie le document mis à jour, upsert : crée un nouveau document si aucun document correspondant n'est trouvé, setDefaultsOnInsert : applique les valeurs par défaut lors de la création
        ).select('-password -__v');

        // On vérifie s'il y a une erreur par rapport aux infos qu'on a touchées juste avant
        (err, docs) => {
            if (!err) { return res.send(docs); }
            if (err) { return res.status(500).send('Update user failed : ' + err); }
        }
        
        // Si l'utilisateur n'existe pas, on renvoie une erreur 404, sinon, on renvoie l'utilisateur mis à jour
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (err) {
        console.log('Error updating user : ' + err);
        res.status(500).json('Server error ' + err);
    }
}


// Nouvelle fonction pour supprimer un utilisateur
module.exports.deleteUser = async (req, res) => {
    // On vérifie si l'ID est valide
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID unknown : ' + req.params.id);
    }

    // On utilise try/catch pour gérer les erreurs
    try {
        // On supprime l'utilisateur par son ID
        const user = await UserModel.findByIdAndDelete(req.params.id).select('-password -__v');
        
        // Si l'utilisateur n'existe pas, on renvoie une erreur 404, sinon, on renvoie un message de succès
        if (!user) {
            return res.status(404).send('User not found');
        }
        console.log('User deleted successfully');
        res.status(200).json('User deleted successfully');
    } catch (err) {
        console.log('Error deleting user : ' + err);
        res.status(500).json('Server error ' + err);
    }
}


// Nouvelle fonction pour suivre un utilisateur
// On prend un ID dans l'URL (follower) et un ID dans le corps de la requête (followed)
// req.params.id : ID de l'utilisateur qui suit, req.body.idToFollow : ID de l'utilisateur à suivre
module.exports.follow = async (req, res) => {
    // Vérification supplémentaire
    if (!req.body || !req.body.idToFollow) {
        return res.status(400).send('Le champ idToFollow est requis dans le body');
    }
    // On vérifie si les ID sont valides
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow)) {
        return res.status(400).send('ID unknown : ' + req.params.id + ' or ' + req.body.idToFollow);
    }

    try {
        // Ajoute l'utilisateur à la liste "following"
        const follower = await UserModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { following: req.body.idToFollow } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // Ajoute l'utilisateur à la liste "followers"
        const followed = await UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            { $addToSet: { followers: req.params.id } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(201).json({ follower, followed });
    } catch (err) {
        console.log('Error following user : ' + err);
        res.status(500).json('Server error ' + err);
    }
}

// Nouvelle fonction pour unfollow un utilisateur
module.exports.unfollow = async (req, res) => {
    // Vérification supplémentaire
    if (!req.body || !req.body.idToUnfollow) {
        return res.status(400).send('Le champ idToUnfollow est requis dans le body');
    }
    // On vérifie si les ID sont valides
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnfollow)) {
        return res.status(400).send('ID unknown : ' + req.params.id + ' or ' + req.body.idToUnfollow);
    }

    try {
        // Retire l'utilisateur de la liste "following"
        const unfollower = await UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { following: req.body.idToUnfollow } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // Retire l'utilisateur de la liste "followers"
        const unfollowed = await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow,
            { $pull: { followers: req.params.id } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(201).json({ unfollower, unfollowed });
    } catch (err) {
        console.log('Error following user : ' + err);
        res.status(500).json('Server error ' + err);
    }
}