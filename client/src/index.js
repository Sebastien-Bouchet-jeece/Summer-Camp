import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.scss';
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";

const store = configureStore({
  reducer: rootReducer,
  // Redux Toolkit includes : 
  // - thunk middleware by default 
  // - DevTools automatically enabled in development 
  // - All the setup needed
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  </Provider>
);


/*
import { thunk } from 'redux-thunk';
import rootReducer from './reducers';

// dev tools
import { applyMiddleware, compose, configureStore } from '@reduxjs/toolkit';
import logger from "redux-logger"

const store = configureStore(
  rootReducer, compose(applyMiddleware(thunk, logger))
)
*/