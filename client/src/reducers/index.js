import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user.reducer";
import usersReducer from './users.reducer'
import postReducer from "./post.reducer";
import errorReducer from "./error.reducer";

export default combineReducers({
    userReducer,
    usersReducer,
    postReducer,
    errorReducer
});