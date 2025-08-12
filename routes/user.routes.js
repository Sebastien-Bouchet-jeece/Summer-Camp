const router = require('express').Router();
const authController = require('../controllers/auth.controller');
/* on a "../"" pour sortir et aller dans le dossier controllers, ensuite on va dans le fichier auth.controller pour récup la fonction signUp */
const userController = require('../controllers/user.controller');
const uploadController = require('../controllers/upload.controller');
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()}); 

// Pour l'auth
router.post("/register", authController.signUp);
// Defines a POST route at "/register". When a request is made to this endpoint, it calls the signUp function from authController.
router.post("/login", authController.signIn);
router.get("/logout", authController.logout);


// User routes
router.get('/', userController.getAllUsers);
// Defines a GET route at "/". When a request is made to this endpoint, it calls the getAllUsers function from userController.
// "/" means all

router.get('/:id', userController.userInfo);

// PUT pour mettre à jour un utilisateur
router.put('/:id', userController.updateUser);

// DELETE pour supprimer un utilisateur
router.delete('/:id', userController.deleteUser);

// Router pour le follow/unfollow
// On utilise "patch" pour modifier seulement un tableau
router.patch('/follow/:id', userController.follow);
router.patch('/unfollow/:id', userController.unfollow);

// Upload de la photo de profil
router.post('/upload', upload.single('file'), uploadController.uploadProfil);

module.exports = router;