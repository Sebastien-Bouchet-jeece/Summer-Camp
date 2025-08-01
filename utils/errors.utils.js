// Ce fichier sert à 

module.exports.signUpErrors = (err) => {
    let errors = { pseudo: '', email: '', password: '' };

    if (err.message.includes('username')) {
        errors.pseudo = 'Pseudo incorrect ou déjà pris';
    }
    if (err.message.includes('email')) {
        errors.email = 'Email incorrect ou déjà pris';
    }
    if (err.message.includes('password')) {
        errors.password = 'Mot de passe trop court, il doit faire plus de 6 caractères';
    }
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('username')) {
        errors.pseudo = 'Pseudo déjà pris';
    }
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('email')) {
        errors.email = 'Email déjà pris';
    }
    return errors;
}

module.exports.signInErrors = (err) => {
    let errors = { email: '', password: '' };

    if (err.message.includes('email')) {
        errors.email = 'Email inconnu';
    }
    if (err.message.includes('password')) {
        errors.password = 'Mot de passe incorrect';
    }
    return errors;
}

module.exports.uploadErrors = (err) => {
    let errors = { format: '', maxSize: '' };

    if (err.message.includes('invalid file')) {
        errors.format = 'Format incompatible';
    }
    if (err.message.includes('max size')) {
        errors.maxSize = 'Le fichier dépasse 500 Ko';
    }
    return errors;
}