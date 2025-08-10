import React from "react";
import LeftNav from "../LeftNav";
import { useSelector } from "react-redux";
import Uploadimg from "./Uploadimg";

const UpdateProfil = () => {
    const userData = useSelector((state) => state.userReducer);

    return (
    <div className="profil-container">
        <LeftNav/>
        <h1>Profil de {userData.username}</h1>
        <div className="update-container">
            <div className="left-part">
                <h3>Photo de profil</h3>
                <img src={userData.picture} alt="user-profile-pic"/>
                <Uploadimg />
                {/*<p>{errors.maxSize}</p>
                <p>{errors.format}</p>*/}
            </div>
        </div>
    </div>
  );
}

export default UpdateProfil;