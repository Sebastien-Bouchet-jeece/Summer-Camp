import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dateParser, isEmpty } from "../Utils";
import FollowHandler from "../Profil/FollowHandler";
import LikeButton from "./LikeButton";

const Card = ({post}) => {
    const [isLoading, setIsLoading] = useState(true);
    const usersData = useSelector((state) => state.usersReducer);
    const userData = useSelector((state) => state.userReducer);
    
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
                                            }).join('')
                                    }
                                </h3>
                                {post.posterId !== userData._id && (
                                    <FollowHandler idToFollow={post.posterId} type={'suggestion'} /* type={'card'} *//>
                                )}
                            </div>

                            <span>{dateParser(post.createdAt)}</span>
                        </div>

                        <p>{post.message}</p>
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