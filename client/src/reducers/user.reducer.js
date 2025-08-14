import { FOLLOW_USER, GET_USER, UNFOLLOW_USER, UPDATE_BIO, UPLOAD_PICTURE } from "../actions/user.actions";

const initialState = {};

// C'est toujours cette même structure
// Le "...state" signifie qu'on garde les données dans le state d'avant, e
// et on ne les remplace juste pas
export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case GET_USER: 
            return action.payload;

        case UPLOAD_PICTURE:
            return { 
                ...state, 
                picture: action.payload,
            };

        case UPDATE_BIO: 
            return {
                ...state,
                bio: action.payload,
            };

        case FOLLOW_USER:
            return {
                ...state,
                following: [action.payload.idToFollow, ...state.following],
            };

        case UNFOLLOW_USER: 
            return {
                ...state,
                following: state.following.filter(
                    (id) => id !== action.payload.idToUnfollow
                ),
            };

        default: 
            return state;
    }
}