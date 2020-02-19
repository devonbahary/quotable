import React, { useEffect } from "react";
import { inject, observer } from "mobx-react";

import View from "./View";

import styles from "./styles/user.scss";


const User = observer(({ store }) => {
    useEffect(() => {
        const timeout = setTimeout(() => gapi.signin2.render(
            'g-signin2',
            {
                'scope': 'profile email',
                'longtitle': true,
                'theme': 'dark',
                'onsuccess': store.onSignIn,
            }
        ), 500);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <View>
            <div className={styles.container}>
                <div className={styles.userInfo}>
                    {store.user && (
                        <>
                            <img className={styles.image} src={store.user.imageUrl} />
                            <p>{store.user.name}</p>
                        </>
                    )}
                </div>
                <div id="g-signin2" className={styles.gSignIn2} />
            </div>
        </View>
    );
});

export default inject('store')(User);