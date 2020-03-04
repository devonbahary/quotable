import React, { useEffect } from "react";
import { Provider } from "mobx-react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Store from "../Store";

import Collections from "./collections/Collections";
import Home from "./Home";
import Quotes from "./Quotes";
import User from "./User";

import ROUTES from "../../constants/routes";

import "./styles/app.scss";

const store = new Store();


const App = () => {
    useEffect(() => {
        setTimeout(() => {
            gapi.load('auth2', async () => {
                const googleAuth = await gapi.auth2.init();

                const googleUser = googleAuth.currentUser.get();
                if (!googleUser.isSignedIn()) return;
                await store.onSignIn(googleUser);
            });
        }, 500);
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
            </Provider>
        </>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));