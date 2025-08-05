import React, {useState} from "react";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";

const Log = ( props ) => {
    // On utilise des hooks pour gérer l'état des modals
    const [signUpModal, setSignUpModal] = useState(props.signUp);
    const [signInModal, setSignInModal] = useState(props.signIn);

    // Fonction pour gérer l'affichage des modals
    /*
    const handleModals = (e) => {
        if (e.target.id === "register") {
            setSignUpModal(true);
            setSignInModal(false);
        } else if (e.target.id === "login") {
            setSignUpModal(false);
            setSignInModal(true);
        }
    } */


    return (
        <div className="connection-form">
            <div className="form-container">
                <ul>
                    <li onClick={() => {setSignInModal(false); setSignUpModal(true);}} className={signUpModal ? "active-btn" : ""}>S'inscrire</li>
                    <li onClick={() => {setSignInModal(true); setSignUpModal(false);}} className={signInModal ? "active-btn" : ""}>Se connecter</li>
                    {/*<li onClick={handleModals} id="register">S'inscrire</li>
                    <li onClick={handleModals} id="login">Se connecter</li>*/}
                </ul>
                {signUpModal && <SignUpForm />}
                {signInModal && <SignInForm />}
            </div>
        </div>
    );
}

export default Log;