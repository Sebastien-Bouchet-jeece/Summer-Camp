import React, { useState } from "react";
import axios from "axios";

const SignUpForm = () => {
  // encore et toujours on utilise le hook useState
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [controlPassword, setControlPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const terms = document.getElementById('terms');
    const pseudoError = document.querySelector('.pseudo.error');
    const emailError = document.querySelector('.email.error');
    const passwordError = document.querySelector('.password.error');
    const passwordConfirmError = document.querySelector('.controlPassword.error');
    const termsError = document.querySelector('.terms.error');

    // Clear all previous errors first
    pseudoError.innerHTML = "";
    emailError.innerHTML = "";
    passwordError.innerHTML = "";
    passwordConfirmError.innerHTML = "";
    termsError.innerHTML = "";

    // Check for validation errors
    let hasValidationErrors = false;

    if (password !== controlPassword) {
      passwordConfirmError.innerHTML = "Les mots de passe ne correspondent pas";
      hasValidationErrors = true;
    }
    
    if (!terms.checked) {
      termsError.innerHTML = "Veuillez accepter les conditions générales";
      hasValidationErrors = true;
    }

    // Only proceed with API call if there are no validation errors
    if (!hasValidationErrors) {
      try {
        const res = await axios({
          method: "POST",
          url: `${process.env.REACT_APP_API_URL}api/user/register`,
          data: {
            username: pseudo, // send as username to match backend
            email,
            password
          }
        });
        
        console.log(res);
        
        if (res.data.errors) {
          // Display server-side errors
          pseudoError.innerHTML = res.data.errors.pseudo || "";
          emailError.innerHTML = res.data.errors.email || "";
          passwordError.innerHTML = res.data.errors.password || "";
        } else {
          // Success! You might want to redirect or show success message
          console.log("Registration successful!");
          // Optionally reset the form
          setPseudo('');
          setEmail('');
          setPassword('');
          setControlPassword('');
          terms.checked = false;
        }
      } catch (err) {
        console.log("Registration error:", err);
        
        if (err.response?.status === 500) {
          pseudoError.innerHTML = "Erreur serveur - Vérifiez que le serveur backend fonctionne";
        } else if (err.response?.status === 400) {
          pseudoError.innerHTML = "Données invalides";
        } else if (!err.response) {
          pseudoError.innerHTML = "Impossible de contacter le serveur - Vérifiez votre connexion";
        } else {
          pseudoError.innerHTML = "Une erreur est survenue lors de l'inscription";
        }
      }
    }
  };

  return (
    // On code le formulaire
    <form action="" onSubmit={handleRegister} id="sign-up-form">
      <label htmlFor="pseudo">Pseudo</label>
      <br/>
      <input 
        type="text" 
        name="pseudo" 
        id="pseudo" 
        value={pseudo}
        onChange={(e) => setPseudo(e.target.value)}
      />
      <div className="pseudo error"></div>
      <br />
      
      <label htmlFor="email">Email</label>
      <br/>
      <input 
        type="text" 
        name="email" 
        id="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="email error"></div>
      <br />
      
      <label htmlFor="password">Password</label>
      <br/>
      <input 
        type="password" 
        name="password" 
        id="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="password error"></div>
      <br />
      
      <label htmlFor="controlPassword">Confirmer le mot de passe</label>
      <br/>
      <input 
        type="password" 
        name="controlPassword" 
        id="controlPassword" 
        value={controlPassword}
        onChange={(e) => setControlPassword(e.target.value)}
      />
      <div className="controlPassword error"></div>
      <br />

      <input type="checkbox" id="terms" />
      <label htmlFor="terms">J'accepte les <a href="/" target="_blank" rel="noopener noreferrer">conditions générales</a></label>
      <div className="terms error"></div>
      <br />

      <input type="submit" value="Valider Inscription" />
    </form>
  );
}

export default SignUpForm;