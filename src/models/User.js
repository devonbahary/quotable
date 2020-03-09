import { throttle } from "lodash";
import { observable, runInAction } from "mobx";
import { updateUserSettings } from "../api";

export default class User {
    @observable isNotificationsOn;

    setGoogleProfile(googleUser) {
        const basicProfile = googleUser.getBasicProfile();

        this.name = basicProfile.getName();
        this.imageUrl = basicProfile.getImageUrl();
    };

    setUserSettings({ isNotificationsOn }) {
        this.isNotificationsOn = isNotificationsOn;
    };

    _toggleNotificationsOn = async isNotificationsOn => {
        await updateUserSettings(isNotificationsOn);
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