import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user.reducer";
import usersReducer from './users.reducer'
import postReducer from "./post.reducer";

export default combineReducers({
    userReducer,
    usersReducer,
    postReducer
});