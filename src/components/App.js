import React from "react";
import { Provider } from "mobx-react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Store from "../Store";

import Authors from "./views/Authors";
import Collections from "./views/Collections";
import Home from "./views/Home";
import Quotes from "./views/quotes/Quotes";
import Topics from "./views/Topics";
import User from "./views/User";

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
                        <Route path={ROUTES.AUTHORS} component={Authors} />
                        <Route path={`${ROUTES.COLLECTIONS}/:id`} component={Quotes} /> {/* TODO: deprecated? */}
                        <Route path={ROUTES.COLLECTIONS} component={Collections} />
                        <Route path={ROUTES.LOGIN} component={User} />
                        <Route path={ROUTES.QUOTES} component={Quotes} />
                        <Route path={ROUTES.TOPICS} component={Topics} />
                    </Switch>
                </BrowserRouter>
            </Provider>
        </>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));