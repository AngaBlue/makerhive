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
        (state: RootState) => state.user,
        (l, r) => {
            let old = r && r.data ? r.data.rank.id : null;
            let updated = l && l.data ? l.data.rank.id : null;
            if (old !== updated && l.requested && l.loading) {
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
                        {pages.map((p) => RouteHandler(p, user.data ? user.data.rank : null))}
                        <Route component={() => <Error name="Not Found" message="Page not found" />} />
                    </Switch>
                </Suspense>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
