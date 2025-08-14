import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "../Utils";
import { followUser, unfollowUser } from "../../actions/user.actions";

const FollowHandler = ({ idToFollow }) => {
    // Pour avoir accés à notre store avec toutes les données utilisateur
    const userData = useSelector((state) => state.userReducer);
    const [isFollowed, setIsFollowed] = useState(false);
    const dispatch = useDispatch();

    const handleFollow = () => {
        dispatch(followUser(userData._id, idToFollow));
        setIsFollowed(true);
    }

    const handleUnfollow = () => {
        dispatch(unfollowUser(userData._id, idToFollow));
        setIsFollowed(false);
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