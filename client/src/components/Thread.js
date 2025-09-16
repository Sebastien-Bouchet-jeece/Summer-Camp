import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../actions/post.actions";
import { isEmpty } from "../components/Utils";
import Card from "./Post/Card";

const Thread = () => {
    const [loadPost, setLoadPost] = useState(true);
    const [count, setCount] = useState(5);
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.postReducer);

    // On compare là où on est exactement dans la page avec la hauteur totale de la page
    // Si position actuelle > hauteur totale, on charge plus de posts
    const loadMore = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 > document.scrollingElement.scrollHeight) {
            setLoadPost(true);
            //setCount(count + 5);
        }
    }

    useEffect(() => {
        if (loadPost) {
            dispatch(getPosts(count));
            setLoadPost(false);
            setCount(count + 5);
        }

        // Pour le scroll infini
        // On dit que si on atteint le bas de la page, on remet à true et on augmente le count de 5

        // Il faut toujours refermer le eventListener après l'avoir ouvert dans un useEffect
        window.addEventListener('scroll',  loadMore);
        return () => window.removeEventListener('scroll', loadMore);
    }, [loadPost, dispatch, count])

    return (
        <div className="thread-container">
            <ul>
                {!isEmpty(posts[0]) && 
                    posts.map((post) => {
                        return <Card post={post} key={post._id} />;
                    })
                }
            </ul>
        </div>
    );
}

export default Thread;