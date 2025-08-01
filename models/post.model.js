// Ce fichier sert à définir la structure des posts dans la base de données MongoDB.
 
// Define the post schema for the structure of the post documents in the MongoDB collection
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema ({
    // Tous les différents tableaux
    // ID de celui qui poste
    posterId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        trim: true,
        maxlength: 500
    },
    picture: {
        type: String
    },
    video: {
        type: String
    },
    likers: {
        type: [String], // What difference between [String] and String ?
        required: true
    },
    comments: {
        type: [{
            commenterId: String,
            commenterUsername: String,
            text: String,
            Timestamp: Number,
        }],
        required: true
    }
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('post', PostSchema);