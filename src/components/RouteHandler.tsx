import React from "react";
import { Page } from "../constants/Page";
import { RootState } from "..";
import { useSelector } from "react-redux";

import Error from "../pages/Error";
import { Route } from "react-router-dom";

const RouteHandler = (props: Page) => {
    //Get User
    const user = useSelector(
        (state: RootState) => state.user.data,
        (l, r) => {
            let old = l ? l.rank.id : null;
            let updated = r ? r.rank.id : null;
            return old === updated;
        }
    );
    //Conditionally Render Component
    if (props.authenticated) {
        if (user) {
            if (props.permissions !== undefined && user.rank.permissions < props.permissions) {
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
