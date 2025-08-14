import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getPosts } from "../actions/post.actions";

const Thread = () => {
    const [loadPost, setLoadPost] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        if (loadPost) {
            dispatch(getPosts());
            setLoadPost(false);
        }
    }, [loadPost, dispatch])

    return (
        <div>
            Thread
        </div>
    );
}

export default Thread;