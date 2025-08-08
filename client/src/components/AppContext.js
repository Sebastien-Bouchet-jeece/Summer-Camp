// On créé un hook contexte pour l'authentification
// Il permet de stocker l'ID de l'utilisateur connecté
// et de le partager entre les composants de l'application
// On peut l'utiliser pour afficher des informations spécifiques à l'utilisateur
// ou pour restreindre l'accès à certaines routes
// Le hook utilise useContext pour accéder au contexte AuthContext
// et useState pour gérer l'état de l'ID utilisateur

import { createContext, useContext, useState } from 'react';

export const UserIdContext = createContext();