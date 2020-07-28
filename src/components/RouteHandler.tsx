import React from "react";
import { Page } from "../constants/Page";
import Error from "../pages/Error";
import { Route } from "react-router-dom";
import { Rank } from "../store/api/Rank";

const RouteHandler = (props: Page, rank: Rank | null) => {
    //Conditionally Render Component
    if (props.authenticated) {
        if (rank) {
            if (props.permissions !== undefined && rank.permissions < props.permissions) {
                props.component = () => (
                    <Error name="Unauthorised" message="You aren't authorised to view this page." />
                );
            }
        } else {
            props.component = () => (
                <Error name="Unauthenticated" message="Please login in order to access this page." />
            );
        }
    }
    return <Route path={props.route} exact={props.exact} component={props.component} key={props.route} />;
};

export default RouteHandler;
