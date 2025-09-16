import React, { useContext, useEffect, useState } from "react";
import { UserIdContext } from "../AppContext";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useDispatch } from "react-redux";
import { likePost, unlikePost } from "../../actions/post.actions";

const LikeButton = ({ post }) => {  // Ajout du prop "post"
    const [liked, setLiked] = useState(false);
    const uid = useContext(UserIdContext);
    const dispatch = useDispatch();

    const like = () => {
        dispatch(likePost(post._id, uid)); // Utilisation du prop "post" pour obtenir l'ID du post
        setLiked(true);
    }

    const unlike = () => {
        dispatch(unlikePost(post._id, uid));
        setLiked(false);
    }

    useEffect(() => {
        if (post.likers.includes(uid)) {
            setLiked(true);
        }
        else {
            setLiked(false);
        }
    }, [post.likers, uid, liked]);

    return (
        <div className="like-container">

            {/* Si l'utilisateur n'est pas connecté */}
            {uid === null && (
                <Popup 
                    trigger={<img src="./img/icons/heart.svg" alt="Like"/>}
                    position={['bottom center', 'bottom right', 'bottom left']}
                    closeOnDocumentClick
                >
                    <div>Please log in to like this post</div>

                </Popup>
            )}

            {/* Si l'utilisateur est connecté et n'a pas encore liké le post */}
            {uid && liked === false && (
                <img 
                    src="./img/icons/heart.svg" 
                    alt="Like" 
                    onClick={like}
                />
            )}

            {/* Si l'utilisateur est connecté et a déjà liké le post */}
            {uid && liked && (
                <img 
                    src="./img/icons/heart-filled.svg" 
                    alt="Unlike" 
                    onClick={unlike}
                />
            )}
        </div>
    );
}

export default LikeButton;