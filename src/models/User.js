export default class User {
    constructor(googleUser) {
        const basicProfile = googleUser.getBasicProfile();
        
        this.name = basicProfile.getName();
        this.imageUrl = basicProfile.getImageUrl();
    }
};