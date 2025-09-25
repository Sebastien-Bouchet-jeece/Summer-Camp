import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty, timestampParser } from "../Utils";
import FollowHandler from "../Profil/FollowHandler";
import { addComment, getPosts } from "../../actions/post.actions";
import EditDeleteComment from "./EditDeleteComment";


const CardComment = ( { post } ) => {
    const [text, setText] = useState('');
    const usersData = useSelector((state) => state.usersReducer);
    const userData = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();

    const handleComment = (e) => {
        e.preventDefault();

        if (text) {
            dispatch(addComment(post._id, userData._id, text, userData.pseudo))
            .then(() => dispatch(getPosts())) // Pour rafraîchir les posts et afficher le nouveau commentaire
            .then(() => setText('')); // Pour vider le champ une fois le commentaire posté
        }
    }
    
    return (
    <div className="comments-container">
        {/* "map" utilisé pour les énumérer un par un, il faut une clé (key) pour savoir quel paramètre utilisé pour énumérer */}
        {post.comments.map((comment) => {
            return (
                <div className={comment.commenterId === userData._id ? 
                    "comment-container client" : 
                    "comment-container"} 
                    key={comment._id}
                >
                    <div className="left-part">
                        <img src={!isEmpty(usersData[0]) && 
                            usersData
                                .map((user) => {
                                    if (user._id === comment.commenterId) return user.picture;
                                    else return null;
                                })
                                .join('')}
                            alt="commenter-pic" 
                        />
                    </div>
                    <div className="right-part">
                        <div className="comment-header">
                            <div className="pseudo">
                                <h3>{comment.commenterUsername}</h3>
                                {comment.commenterId !== userData._id && (
                                    <FollowHandler idToFollow={comment.commenterId} type="card" />
                                )}
                            </div>
                            <span>{timestampParser(comment.timestamp)}</span>
                        </div>
                        <p>{comment.text}</p>

                        <EditDeleteComment comment={comment} postId={post._id} />
                    </div>
                </div>
            )
        })}

        {userData._id && (
            <form action={""} onSubmit={handleComment} className="comment-form">
                <input 
                    type="text" 
                    name="text" 
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                    placeholder="Write a comment"
                />
                <br/>
                <input type="submit" value="Send" />
            </form>
        )}
    </div>
    );
}

export default CardComment;