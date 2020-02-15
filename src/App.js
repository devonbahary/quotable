import React, { useEffect } from "react";
import { Provider } from "mobx-react";
import ReactDOM from "react-dom";
import { authenticateUser } from "./api";
import Store from "./Store";


import styles from "./styles/app.scss";


const store = new Store();

const App = () => {
    useEffect(() => {
        const onSignIn = async googleUser => {
            const { id_token: token } = googleUser.getAuthResponse();
            await authenticateUser(token);
            await store.getUser();
        };

        gapi.signin2.render(
            'g-signin2',
            {
                'scope': 'profile email',
                'longtitle': true,
                'theme': 'dark',
                'onsuccess': onSignIn,
            }
        );
    });

    return (
        <>
            <Provider store={store}>
                <h1>Quotable</h1>
                <div id="g-signin2" />
            </Provider>
        </>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));