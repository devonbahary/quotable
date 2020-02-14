import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import {authenticateUser} from "./api/authentication";

import styles from "./styles/app.scss";


const App = () => {
    useEffect(() => {
        const onSignIn = async googleUser => {
            const { id_token: token } = googleUser.getAuthResponse();
            await authenticateUser(token);
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
            <h1>Quotable</h1>
            <div id="g-signin2" />
        </>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));