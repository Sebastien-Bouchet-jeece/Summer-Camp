import React, { useContext } from "react";
import Log from "../components/Log";
import { UserIdContext } from "../components/AppContext";
import UpdateProfil from "../components/Profil/UpdateProfil";

const Profil = () => {
  const UserId = useContext(UserIdContext);

  return (
    <div className="profil-page">
      {UserId ? (
        <UpdateProfil />
      ) : (
        <div className="log-container">
          <Log signIn={false} signUp={true} />
          <div className="img-container">
            <img src="/img/log.svg" alt="img-log" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Profil;