import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dateParser, isEmpty } from "../Utils";
import FollowHandler from "../Profil/FollowHandler";
import LikeButton from "./LikeButton";
import { updatePost } from "../../actions/post.actions";
import DeleteCard from "./DeleteCard";

const Card = ({post}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdated, setIsUpdated] = useState(false);
    const [textUpdate, setTextUpdate] = useState(null);
    const usersData = useSelector((state) => state.usersReducer);
    const userData = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();

    const updateItem = () => {
        if (textUpdate) {
            dispatch(updatePost(post._id, textUpdate));
        }
        setIsUpdated(false);
    }
    
    useEffect(() => {
        !isEmpty(usersData[0]) && setIsLoading(false);
    }, [usersData])

    return (
        <li className="card-container" key={post._id}>
            {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
            ) : (
                <>
                    {/*<div className="card-left">
                        {!isEmpty(usersData[0]) && (() => {
                            const user = usersData.find(user => user.id === post.posterId);
                            return user?.picture ? (
                                <img src={user.picture} alt="User profile" />
                            ) : null;
                        })()}
                    </div>*/}

                    <div className="card-left">
                        {!isEmpty(usersData[0]) &&
                        usersData
                            .filter(user => user._id === post.posterId)
                            .map(user => 
                                user?.picture ? (
                                    <img 
                                        key={user._id}
                                        src={user.picture}
                                        alt="User profile-pic"
                                    />
                                ) : null
                            )
                        }
                    </div>

                    <div className="card-right">
                        <div className="card-header">
                            <div className="pseudo">
                                <h3>
                                    {!isEmpty(usersData[0]) &&
                                        usersData
                                            .map((user) => {
                                                if (user._id === post.posterId) {
                                                    return user.username;
                                                }
                                                else return null;
                                            }).join('')
                                    }
                                </h3>
                                {post.posterId !== userData._id && (
                                    <FollowHandler idToFollow={post.posterId} type={'suggestion'} /* type={'card'} *//>
                                )}
                            </div>

                            <span>{dateParser(post.createdAt)}</span>
                        </div>

                        {/* Pour un nouveau post */}
                        {isUpdated === false && <p>{post.message}</p>}
                        {isUpdated && (
                            <div className="update-post">
                                <textarea
                                    defaultValue={post.message}
                                    onChange={(e) => setTextUpdate(e.target.value)}
                                />
                                <div className="button-container">
                                    <button className="btn" onClick={updateItem}>
                                        Accept Changes
                                    </button>
                                </div>
                            </div>
                        )}
                        {post.picture && 
                            <img src={post.picture} alt="card-pic" className="card-pic"/>
                        }
                        {post.video && (
                            <iframe
                                width="500"
                                height="300"
                                src={post.video}
                                style={{border: 'none'}}
                                allow="accelerometer; autoplay; clipboard-write; 
                                encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={post._id}
                            ></iframe>
                        )}

                        {userData._id === post.posterId && (
                            <div className="button-container">
                                <div onClick={() => setIsUpdated(!isUpdated)}>
                                    <img src="./img/icons/edit.svg" alt="edit-post" />
                                </div>
                                <DeleteCard id={post._id} />
                            </div>
                        )}

                        <div className="card-footer">
                            <div className="comment-icon">
                                <img src="./img/icons/message1.svg" alt="comment"/>
                                <span>{post.comments.length}</span>
                            </div>

                            <LikeButton post={post}/> {/* utilise le prop "post" pour savoir quel post a été liké */}
                            <img src="./img/icons/share.svg" alt="share"/>
                        </div>
                        
                    </div>
                </>
            )}
        </li>
    );
}

export default Card;