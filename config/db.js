const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://' + process.env.DB_USER_PASS + '@cluster0.4lr4exy.mongodb.net/summer_camp?retryWrites=true&w=majority',
    /* options qui ne sont plus nécessaires car évolution de mongodb
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
    }*/
)
// .then retournée pour un succès, .catch pour une erreur
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log("Failed to connect to MongoDB", err));