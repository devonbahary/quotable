import React, { useEffect } from "react";
import { Provider } from "mobx-react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { authenticateUser } from "../api";
import Store from "../Store";

import Collections from "./Collections";
import Home from "./Home";
import Quotes from "./Quotes";
import User from "./User";

import ROUTES from "../../constants/routes";

import styles from "./styles/app.scss";


const store = new Store();

const App = () => {
    useEffect(() => {
        const onSignIn = async googleUser => {
            const { id_token: token } = googleUser.getAuthResponse();
            await authenticateUser(token);
            await store.getUser();
        };

        setTimeout(() => gapi.signin2.render(
            'g-signin2',
            {
                'scope': 'profile email',
                'longtitle': true,
                'theme': 'dark',
                'onsuccess': onSignIn,
            }
        ), 500);
    });

    return (
        <>
            <Provider store={store}>
                <BrowserRouter>
                    <Switch>
                        <Route path={ROUTES.HOME} exact component={Home} />
                        <Route path={ROUTES.COLLECTIONS} component={Collections} />
                        <Route path={ROUTES.QUOTES} component={Quotes} />
                        <Route path={ROUTES.LOGIN} component={User} />
                    </Switch>
                </BrowserRouter>
                <div id="g-signin2" />
            </Provider>
        </>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));