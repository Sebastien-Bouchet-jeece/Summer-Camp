const router = require('express').Router();
const postController = require('../controllers/post.controller');
const multer = require('multer');
const upload = multer(); 

// Fonctions (readPost, createPost, etc) à définir
router.get('/', postController.readPost);
router.post('/', upload.single('file'), postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

// Like/Unlike

router.patch('/like/:id', postController.likePost);
router.patch('/unlike/:id', postController.unlikePost);

// Comments

router.patch('/comment-post/:id', postController.commentPost);
router.patch('/edit-comment-post/:id', postController.editCommentPost);
router.patch('/delete-comment-post/:id', postController.deleteCommentPost);

module.exports = router;