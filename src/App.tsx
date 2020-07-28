import React, { Suspense } from "react";
import Layout from "./layout/Layout";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import pages from "./constants/pages";
import RouteHandler from "./components/RouteHandler";
import Error from "./pages/Error";
import Loading from "./components/Loading";
import "./App.module.less";
import { useSelector } from "react-redux";
import { RootState } from "./store/reducer";

function App() {
    const user = useSelector(
        (state: RootState) => state.user.data,
        (l, r) => {
            let old = l ? l.rank.id : null;
            let updated = r ? r.rank.id : null;
            //!!!Try Avoid Force Reloading and Instead Figure out Why React Components aren't Updating
            if (old !== updated) {
                console.log("reloading...");
                window.location.reload();
            }
            return old === updated;
        }
    );
    return (
        <BrowserRouter>
            <Layout>
                <Suspense fallback={<Loading />}>
                    <Switch>
                        {pages.map((p) => RouteHandler(p, user ? user.rank : null))}
                        <Route component={() => <Error name="Not Found" message="Page not found" />} />
                    </Switch>
                </Suspense>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
