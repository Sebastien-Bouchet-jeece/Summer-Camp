import React from "react";
import axios from "axios"; // Pour faire des requêtes HTTP, fetch

const SignInForm = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleLogin = (e) => {
        e.preventDefault(); // Pour éviter le rechargement de la page
        
        // Clear previous error messages
        const emailError = document.querySelector(".email.error");
        const passwordError = document.querySelector(".password.error");

        // Debug: Log the API URL and data being sent
        console.log("API URL:", `${process.env.REACT_APP_API_URL}api/user/login`);
        console.log("Data being sent:", { email, password });


        // On envoie les données à l'API pour la connexion
        // Assurez-vous que l'URL de l'API est correcte et que le backend est en cours d'exécution
        // Vous pouvez utiliser fetch ou axios pour faire la requête
        // Ici, nous utilisons axios pour envoyer une requête POST à l'API de connexion
        
        // POST avec l'URL de l'API (localhost://...) + api/user/login est une route définie dans le backend
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API_URL}api/user/login`, // L'URL de votre API
            withCredentials: true, // Pour envoyer les cookies
            data: {
                email: email,
                password: password
            }
        })
        .then((res) => {
            console.log(res); // Pour voir la réponse de l'API dans la console
            if (res.data.errors) {
                emailError.innerHTML = res.data.errors.email;
                passwordError.innerHTML = res.data.errors.password;
            } else {
                window.location = "/"; // Redirige vers la page d'accueil après la connexion réussie
            }
        })
        .catch((err) => {
            console.error(err);
        })
    }

    return (
        <form action="" onSubmit={handleLogin} id="sign-up-form">
            <label htmlFor="email">Email</label>
            <br />
            {/* Input de l'email, le label se connecte à l'input */}
            <input
                type="text"
                id="email"
                name="email"
                value={email}
                // Pour stocker la valeur de l'input dans l'état
                onChange={(e) => setEmail(e.target.value)}
                //required
            />
            <div className="email error"></div>

            <br />

            <label htmlFor="password">Mot de passe</label>
            <br />
            {/* Input du mot de passe */}
            <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                //required
            />
            <div className="password error"></div>
            <br />

            <input type="submit" value="Se connecter" />
        </form>
    );
}

export default SignInForm;