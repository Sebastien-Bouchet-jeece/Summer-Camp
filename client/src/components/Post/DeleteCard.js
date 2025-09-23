import React from "react";
import { useDispatch } from "react-redux";

const DeleteCard = () => {

    const dispatch = useDispatch();

    const deleteQuote = () => {
        
    }
    
  return (
    <div onClick={() => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            deleteQuote();
        }
    }}>
        <img src="./img/icons/trash.svg" alt="delete-post" />
    </div>
  );
}

export default DeleteCard;