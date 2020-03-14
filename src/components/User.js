import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import classNames from "classnames";

import View from "./View";

import { requestNotificationsPermission } from "../push-notifications";

import styles from "./styles/user.scss";


const Notifications = observer(({ store }) => {
    const { user } = store;

    const [ isNotificationsDenied, setIsNotificationsDenied ] = useState(false);

    const toggleIsNotificationsOn = async () => {
        if (isNotificationsDenied) return;

        const isNotificationsOn = !user.isNotificationsOn;
        if (isNotificationsOn) {
            const permission = await requestNotificationsPermission();
            if (permission === 'denied') return setIsNotificationsDenied(true);
        }

        await user.toggleNotificationsOn();
    };

    const toggleBtnClassName = classNames(styles.toggleBtn, {
        [styles.active]: user && user.isNotificationsOn,
    });

    let msg1, msg2;
    if (isNotificationsDenied) {
        msg1 = 'It looks like you\'ve blocked notifications from this website.';
        msg2 = 'Please try to enable them in your browser\'s settings.'
    } else if (user.isNotificationsOn) {
        msg1 = 'You\'re receiving a daily reminder of a random quote from your library.';
        msg2 = 'Turn off notifications at any time.';
    } else {
        msg1 = 'Get a daily reminder of a random quote from your library.';
        msg2 = 'Turn off notifications at any time.';
    }

    return (
        <div className={styles.notifications}>
            <div className={styles.toggleNotifications}>
                <div className={styles.toggleBtnContainer} onClick={toggleIsNotificationsOn}>
                    <div className={styles.toggleBtnBackground}>
                        <div className={toggleBtnClassName} />
                    </div>
                </div>
                <div>
                    Turn Notifications {user.isNotificationsOn ? 'Off' : 'On'}
                </div>
            </div>
            <div className={styles.notificationsInfo}>
                {msg1}<br/><br/>
                {msg2}
            </div>
        </div>
    );
});

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
                            <p className={styles.userName}>{store.user.name}</p>
                            <Notifications store={store} />
                        </>
                    )}
                </div>
                <div id="g-signin2" className={styles.gSignIn2} />
            </div>
        </View>
    );
});

export default inject('store')(User);