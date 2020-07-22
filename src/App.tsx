import React, { Suspense } from "react";
import Layout from "./layout/Layout";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import pages from "./constants/pages";
import RouteHandler from "./components/RouteHandler";
import Error from "./pages/Error";
import Loading from "./components/Loading";
import "./App.module.less";

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Suspense fallback={<Loading />}>
                    <Switch>
                        {pages.map((p) => RouteHandler(p))}
                        <Route component={() => <Error name="Not Found" message="Page not found" />} />
                    </Switch>
                </Suspense>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
