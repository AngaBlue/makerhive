import React, { Suspense } from "react";
import Layout from "./layout/Layout";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import styles from "./App.module.less";
import pages from "./constants/pages";
import RouteHandler from "./components/RouteHandler";
import Error from "./pages/Error";
import { Spin } from "antd";

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Suspense fallback={<div className={styles.loading}><Spin size={"large"} style={{height: "128px"}}/></div>}>
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
