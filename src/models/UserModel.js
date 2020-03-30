import { throttle } from "lodash";
import { observable, runInAction } from "mobx";
import { updateUserSettings } from "../api/user";
import { subscribeToPushNotifications } from "../push-notifications";

export default class UserModel {
    @observable isNotificationsOn;

    setGoogleProfile(googleUser) {
        const basicProfile = googleUser.getBasicProfile();

        this.name = basicProfile.getName();
        this.imageUrl = basicProfile.getImageUrl();
    };

    async setUserSettings({ isNotificationsOn }) {
        this.isNotificationsOn = isNotificationsOn;
        if (this.isNotificationsOn) await subscribeToPushNotifications()
    };

    _toggleNotificationsOn = async isNotificationsOn => {
        await updateUserSettings(isNotificationsOn);
        if (isNotificationsOn) await subscribeToPushNotifications();
        runInAction(() => {
            this.isNotificationsOn = isNotificationsOn;
        });
    };

    toggleNotificationsOn = async () => {
        const isNotificationsOn = !this.isNotificationsOn;
        this.debouncedToggleNotificationsOn(isNotificationsOn);
    };

    debouncedToggleNotificationsOn = throttle(this._toggleNotificationsOn, 250);
};