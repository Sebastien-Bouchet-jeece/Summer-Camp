const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');

// require "met au courant" que le fichier existe :
// c'est-à-dire qu'il va pouvoir exécuter le code du fichier
require('dotenv').config({path: './config/.env'});
require('./config/db'); 

const {authMiddleware, requireAuth} = require('./middleware/auth.middleware');

const cors = require('cors');


const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL, // Autorise les requêtes depuis l'URL du client
  credentials: true,
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false,
  'optionsSuccessStatus': 204
}

app.use(cors(corsOptions)); // pour autoriser les requêtes CORS

// middleware
app.use(bodyParser.json()); // pour parser le JSON dans les requêtes entrantes
app.use(bodyParser.urlencoded({ extended: true })); // pour parser les données URL-encodées
app.use(cookieParser()); // pour parser les cookies


// jwt middleware
app.get('/api/user', authMiddleware); // Applique le middleware d'authentification à toutes les routes
app.get('/api/user/jwtid', requireAuth, (req, res) => {
    res.status(200).json({ id: res.locals.user._id }); // Envoie l'ID de l'utilisateur authentifié
});

// routes
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

// server
// Toujours obligé de mettre le process.env pour accéder aux variables d'environnement
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
}); 