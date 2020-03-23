import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit';

import App from './App';
import * as serviceWorker from './serviceWorker';
import rootReducer from "./store/reducer";

export const store = configureStore({
    reducer: rootReducer
});

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
serviceWorker.register();
