import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isEmpty } from "../Utils";

const FollowHandler = ({ idToFollow }) => {
    // Pour avoir accés à notre store avec toutes les données utilisateur
    const userData = useSelector((state) => state.userReducer);

    const [isFollowed, setIsFollowed] = useState(false);

    const handleFollow = () => {
        
    }

    const handleUnfollow = () => {

    }

    useEffect(() => {
        if (!isEmpty(userData.following)) {
            if (userData.following.includes(idToFollow)) {
                setIsFollowed(true);
            }
            else {
                setIsFollowed(false);
            }
        }

    }, [userData, idToFollow])

  return (
    <>
        {isFollowed && !isEmpty(userData) && (
            <span onClick={handleUnfollow}>
                <button className="unfollow-btn"> Abonné </button>
            </span>
        )}
        {(isFollowed === false) && !isEmpty(userData) && (
            <span onClick={handleFollow}>
                <button className="unfollow-btn"> Suivre </button>
            </span>
        )}
    </>
  );
}

export default FollowHandler;