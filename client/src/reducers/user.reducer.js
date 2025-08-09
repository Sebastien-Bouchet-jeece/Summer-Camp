import { GET_USER } from "../actions/user.actions";


const initialState = {};

// C'est toujours cette même structure
export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case GET_USER: 
            return action.payload;

        default: 
            return state;
    }
}