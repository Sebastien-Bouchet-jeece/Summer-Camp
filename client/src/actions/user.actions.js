import axios from "axios";

export const GET_USER = "GET_USER";

export const getUser = (userId) => {
    // Dispatch c'est les données qui vont au reducer, 
    // ce qui va être mis dans le store
    return (dispatch) => {
        return axios
        .get(`${process.env.REACT_APP_API_URL}api/user/${userId}`)
        .then((res) => {
            dispatch({ type: GET_USER, payload: res.data });
        })
        .catch((err) => console.log(err));
    };
};