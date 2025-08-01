// Import mongoose to interact with MongoDB
const mongoose = require('mongoose'); 
const { isEmail } = require('../node_modules/validator'); // Import a utility function to validate email format
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

// Define the user schema for the structure of the user documents in the MongoDB collection
const userSchema = new mongoose.Schema({
    // Tous les différents tableaux
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        unique: true,
        trim: true // pour supprimer les espaces au début et à la fin
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate : [isEmail], // Utilise la fonction isEmail pour valider le format de l'email
        lowercase: true, 
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024,
        trim: true
    },
    picture: {
        type: String,
        default: "./uploads/profil/default.png", // Chemin par défaut de l'image de profil
    },
    bio: {
        type: String,
        maxlength: 1024,
    },
    followers: {
        type: [String]
    },
    following: {
        type: [String]
    },
    likes: {
        type: [String]
    },
},
{
    timestamps: true // pour ajouter les champs createdAt et updatedAt automatiquement
}
);

// On écrit une fonction qui sera appelée avant de sauvegarder un utilisateur
userSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt(); // Génère un sel pour le hachage du mot de passe
    
    // Hache le mot de passe avec le sel généré
    // On utilise "this" pour accéder au mot de passe de l'utilisateur en cours
    this.password = await bcrypt.hash(this.password, salt); // Hache le mot de passe avec le sel
    next(); // Passe à la prochaine étape du middleware
})

// On dé-sale le mot de passe pour la connexion
userSchema.statics.login = async function(email, password) {
    // On cherche l'utilisateur par son email
    const user = await this.findOne({ email });
    
    // Si l'utilisateur n'existe pas, on renvoie une erreur
    if (!user) {
        throw Error('Incorrect email');
    }

    // On compare le mot de passe envoyé avec le mot de passe haché dans la BDD
    const auth = await bcrypt.compare(password, user.password);
    
    // Si les mots de passe ne correspondent pas, on renvoie une erreur
    if (!auth) {
        throw Error('Incorrect password');
    }

    return user; // Renvoie l'utilisateur si tout est correct
}

const User = mongoose.model('User', userSchema);

module.exports = User;