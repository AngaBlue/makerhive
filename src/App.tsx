import React from "react";
import Layout from "./layout/Layout";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.module.less";

//Routes
const Index = React.lazy(() => import("./pages/Index"));

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Switch>
                    <Route exact path="/" component={Index} />
                </Switch>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
