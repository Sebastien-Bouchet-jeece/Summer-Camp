import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadPicture } from "../../actions/user.actions";

const Uploadimg = () => {
    const [file, setFile] = useState();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.userReducer);
    
    const handlePicture = (e) => {
        e.preventDefault();

        // Check if a file was selected
        if (!file) {
            return;
        }

        const data = new FormData();
        data.append("name", userData.username);
        data.append("userId", userData._id);
        data.append("file", file);

        dispatch(uploadPicture(data, userData._id));
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        
        // Check if a file was actually selected (not cancelled)
        if (!selectedFile) {
            return;
        }
        
        setFile(selectedFile);
    }

    return (
        <form action="" onSubmit={handlePicture} className="upload-pic">
            <label htmlFor="file">Changer d'image</label>
            {/* On met name="file" car en backend on avait dit de seulement 
            accepter la requête si le fichier reçu s'appelle "file" */}
            <input 
                type="file" 
                id="file" 
                name="file" 
                accept=".jpg, .jpeg, .png" 
                onChange={handleFileChange}
                // Le onChange va mettre dans une variable "file" ce qu'on a mis dans l'input
            />
            <br />
            <input type="submit" value="Envoyer"/>
        </form>
    );
}

export default Uploadimg;