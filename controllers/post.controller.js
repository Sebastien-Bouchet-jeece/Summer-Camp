// Ce fichier contient les fonctions pour gérer les posts
const PostModel = require('../models/post.model');
const User = require('../models/user.model');
const UserModel = require('../models/user.model');
const { uploadErrors } = require('../utils/errors.utils');
const ObjectID = require('mongoose').Types.ObjectId;
const fs = require('fs'); // on importe le module fs pour manipuler les fichiers
const { promisify } = require('util'); // on importe promisify pour convertir les fonctions basées sur des callbacks en promesses
const pipeline = promisify(require('stream').pipeline); // on crée une promesse pour la fonction pipeline

// On exporte les fonctions pour les utiliser dans les routes
module.exports.readPost = async (req, res) => {
    try {
        const posts = await PostModel.find().sort({ createdAt: -1 }); // On récupère tous les posts, triés par date de création (du plus récent au plus ancien)
        res.send(posts);
    } catch (err) {
        console.log('Error retrieving data : ' + err);
        res.status(500).send('Error retrieving data');
    } 
}

module.exports.createPost = async (req, res) => {

    // Première partie : s'il y a une image à traiter
    let fileName;
    // Si un fichier est envoyé, on le traite
    if (req.file) {
        try {
            console.log('Mimetype:', req.file.mimetype);
            if (req.file.mimetype !== 'image/jpg' &&
                req.file.mimetype !== 'image/png' && 
                req.file.mimetype !== 'image/jpeg') 
                {
                return res.status(400).json({ error: 'Invalid file type. Only jpg, png, and jpeg are allowed.' });
            }
    
            if (req.file.size > 500000) { // 500000 bytes = 500 KB
                return res.status(400).json({ error: 'File size exceeds limit of 500KB.' });
            }
        } catch (err) {
            const errors = uploadErrors(err);
            console.error('Error uploading file:', err);
            return res.status(400).json({ errors });
        }

        fileName = req.body.posterId + Date.now() + ".jpg"; // on crée un nom de fichier unique basé sur l'ID de l'utilisateur et la date actuelle

        await fs.promises.writeFile(
            `${__dirname}/../client/public/uploads/posts/${fileName}`,
            req.file.buffer
        );
    }

    // Deuxième partie : on crée le post
    // On remplit le nouveau post avec ttes les infos données par l'utilisateur 
    // dans le req.body qui correspondent aux champs donnés dans post.model.js
    const newPost = new PostModel ({
        posterId: req.body.posterId,
        message: req.body.message,
        picture: req.file ? "./uploads/posts/" + fileName : "", // si un fichier est envoyé, on met le chemin du fichier, sinon on met une chaîne vide
        video: req.body.video,
        likers: [],
        comments: [],
    });

    try {
        const post = await newPost.save(); // on attend que le nouveau post soit sauvegardé
        return res.status(201).json(post); // si ça marche, message de réussite
    }
    catch (err) {
        return res.status(400).send(err); // si ça marche pas, message d'erreur
    }
}

module.exports.updatePost = async (req, res) => {
    // On vérifie si l'ID est valide
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID unknown : ' + req.params.id);
    }

    const updatedPost = {
        message: req.body.message,
        video: req.body.video,
    };

    try {
        const docs = await PostModel.findByIdAndUpdate(
            req.params.id,
            { $set: updatedPost },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        return res.send(docs);
    } catch (err) {
        console.log('Update error : ' + err);
        return res.status(500).send({ message: err });
    }
}

module.exports.deletePost = async (req, res) => {
    // On vérifie si l'ID est valide
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID unknown : ' + req.params.id);
    }

    try {
        const docs = await PostModel.findByIdAndDelete(req.params.id);
        return res.send(docs);
    } catch (err) {
        console.log('Error deleting post : ' + err);
        return res.status(500).send({ message: err });
    }
}


// ID du post dans l'input (req.params.id) et ID de l'utilisateur dans le body (req.body.id)
module.exports.likePost = async (req, res) => {
    // On vérifie si l'ID du post et de l'utilisateur sont valides
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.id)) {
        return res.status(400).send('ID unknown : ' + req.params.id + ' or ' + req.body.id);
    }

    try {
        const post = await PostModel.findByIdAndUpdate(
            req.params.id,
            // On utilise $addToSet pour ajouter l'utilisateur aux likers, qui est un tableau dans le modèle Post
            // $addToSet ne l'ajoute que s'il n'est pas déjà présent
            { $addToSet: { likers: req.body.id } }, // on ajoute l'utilisateur aux likers
            { new: true }
        );

        await UserModel.findByIdAndUpdate(req.body.id, 
            { $addToSet : { likes: req.params.id } }, // on ajoute le post aux likes de l'utilisateur
            { new: true }
        );

        // On retourne le post mis à jour
        return res.send(post);
    } catch (err) {
        console.log('Error liking post : ' + err);
        return res.status(400).send({ message: err });
    }
}

// Pour le like/unlike post, c'est la même méthode que pour le follow/unfollow : 
// On remplace juste le $addToSet par $pull pour retirer l'utilisateur des tableaux au lieu de l'ajouter
module.exports.unlikePost = async (req, res) => {
    // On vérifie si l'ID du post et de l'utilisateur sont valides
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.id)) {
        return res.status(400).send('ID unknown : ' + req.params.id + ' or ' + req.body.id);
    }

    try {
        const post = await PostModel.findByIdAndUpdate(
            req.params.id,
            // On utilise $pull pour retirer l'utilisateur des likers
            { $pull: { likers: req.body.id } }, // on retire l'utilisateur des likers
            { new: true }
        );

        await UserModel.findByIdAndUpdate(req.body.id, 
            { $pull : { likes: req.params.id } }, // on retire le post des likes de l'utilisateur
            { new: true }
        );

        // On retourne le post mis à jour
        return res.send(post);
    } catch (err) {
        console.log('Error unliking post : ' + err);
        return res.status(400).send({ message: err });
    }
}


// Commenter un post
module.exports.commentPost = async (req, res) => {
    // On vérifie si l'ID du post et de l'utilisateur sont valides
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.id)) {
        return res.status(400).send('ID unknown : ' + req.params.id + ' or ' + req.body.id);
    }

    // On crée un objet commentaire
    // Il faut mettre un "id":, un "text":, etc. dans le body de la requête
    const comment = {
        commenterId: req.body.id,
        commenterUsername: req.body.username,
        text: req.body.text,
        timestamp: new Date().getTime(), // on ajoute un timestamp pour le commentaire
    };

    try {
        const post = await PostModel.findByIdAndUpdate(
            req.params.id,
            { $push: { comments: comment } }, // on ajoute le commentaire au tableau des commentaires
            { new: true }
        );

        return res.send(post);
    } catch (err) {
        console.log('Error commenting post : ' + err);
        return res.status(400).send({ message: err });
    }
}

// Editer un commentaire
module.exports.editCommentPost = async (req, res) => {
    // On vérifie si l'ID du post et de l'utilisateur sont valides
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.commentId)) {
        return res.status(400).send('ID unknown : ' + req.params.id + ' or ' + req.body.commentId);
    }

    const updatedComment = {
        text: req.body.text,
    };

    try {
        const post = await PostModel.findOneAndUpdate(
            { _id: req.params.id, "comments._id": req.body.commentId },
            { $set: { "comments.$": updatedComment } }, // on met à jour le commentaire spécifique
            { new: true }
        );

        return res.status(200).send(post);
    } catch (err) {
        console.log('Error editing comment : ' + err);
        return res.status(400).send({ message: err });
    }
}

// Supprimer un commentaire
module.exports.deleteCommentPost = async (req, res) => {
    // On vérifie si l'ID du post et de l'utilisateur sont valides
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.commentId)) {
        return res.status(400).send('ID unknown : ' + req.params.id + ' or ' + req.body.commentId);
    }

    try {
        const post = await PostModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { comments: { _id: req.body.commentId } } }, // on retire le commentaire du tableau des commentaires
            { new: true }
        );

        return res.status(200).send(post);
    } catch (err) {
        console.log('Error deleting comment : ' + err);
        return res.status(400).send({ message: err });
    }
}