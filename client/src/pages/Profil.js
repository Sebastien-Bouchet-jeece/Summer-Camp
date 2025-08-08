import React, { useContext } from "react";
import Log from "../components/Log";
import { UserIdContext } from "../components/AppContext";

const Profil = () => {
  const UserId = useContext(UserIdContext);

  return (
    <div className="profil-page">
      {UserId ? (
        <h1>UPDATE PAGE</h1>
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