const UserModel = require('../models/user.model'); // on importe le modèle User
const fs = require('fs'); // on importe le module fs pour manipuler les fichiers
const { promisify } = require('util'); // on importe promisify pour convertir les fonctions basées sur des callbacks en promesses
const { uploadErrors } = require('../utils/errors.utils');
const pipeline = promisify(require('stream').pipeline); // on crée une promesse pour la fonction pipeline

module.exports.uploadProfil = async (req, res) => {
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

    const fileName = req.body.name + ".jpg"; // on crée un nom de fichier unique basé sur le nom envoyé dans le corps de la requête

    // On écrit le fichier dans le dossier public/uploads/profil
    await fs.promises.writeFile(
        `${__dirname}/../client/public/uploads/profil/${fileName}`,
        req.file.buffer
    );

    try {
        await UserModel.findByIdAndUpdate(
            req.body.userId, 
            { $set: { picture: "./uploads/profil/" + fileName } },
            { new: true, upsert: true, setDefaultsOnInsert: true } // on met à jour le champ picture de l'utilisateur
        );
    } catch (err) {
        console.error('Error updating user profile picture:', err);
        return res.status(500).json({ error: 'Error updating user profile picture' + `: ${err.message}` });
    }

    return res.status(201).json({ message: 'File uploaded successfully' });
}