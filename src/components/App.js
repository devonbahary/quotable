import React, { useEffect } from "react";
import { Provider } from "mobx-react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Store from "../Store";

import Collections from "./collections/Collections";
import Home from "./Home";
import Quotes from "./quotes/Quotes";
import User from "./User";

import useGoogleAuth from "./hooks/useGoogleAuth";

import ROUTES from "../../constants/routes";

import "./styles/app.scss";

const store = new Store();

const App = () => {
    useGoogleAuth(store);

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