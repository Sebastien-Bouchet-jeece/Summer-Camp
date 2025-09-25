import React, { useContext, useEffect, useState } from "react";
import { UserIdContext } from "../AppContext";
import { useDispatch } from "react-redux";
import { deleteComment, editComment } from "../../actions/post.actions";

const EditDeleteComment = ( { comment, postId } ) => {
    const [isAuthor, setIsAuthor] = useState(false);
    const [edit, setEdit] = useState(false);
    const [text, setText] = useState("");

    const uid = useContext(UserIdContext);
    const dispatch = useDispatch();

    const handleEdit = (e) => {
        e.preventDefault();

        // Dispatch edit comment action
        if (text) {
            dispatch(editComment(postId, comment._id, text));
            setText("");
            setEdit(false);
        }
    }

    const handleDelete = () => dispatch(deleteComment(postId, comment._id));

    useEffect(() => {
        const checkAuthor = () => {
            if (uid === comment.commenterId) {
                setIsAuthor(true);
            }
        }
        checkAuthor();
    }, [uid, comment.commenterId])

    return (
        <div className="edit-comment">
            {isAuthor && edit === false && (
                <span onClick={() => setEdit(!edit)}>
                    <img src="./img/icons/edit.svg" alt="edit-comment-icon"/>
                </span>
            )}  
            {isAuthor && edit && (
                <form 
                    action=""  
                    onSubmit={handleEdit} 
                    className="edit-comment-form"
                >
                    <label htmlFor="text" onClick={() => setEdit(!edit)}>Edit</label>  
                    <br/>
                    <input 
                        type="text" 
                        name="text"
                        onChange={(e) => setText(e.target.value)}
                        defaultValue={comment.text}
                    />
                    <br/>
                    <div className="btn">
                        <span onClick={() => {
                            if (window.confirm("Are you sure you want to delete this comment?")) {
                                handleDelete();
                            }
                        }}>
                            <img src="./img/icons/trash.svg" alt="delete-comment-icon"/>
                        </span>
                    
                    <input type="submit" value="Valider modification" />
                    </div>
                </form>
            )}          
        </div>
    );
};

export default EditDeleteComment;
