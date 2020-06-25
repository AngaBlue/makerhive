import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

serviceWorker.unregister();
