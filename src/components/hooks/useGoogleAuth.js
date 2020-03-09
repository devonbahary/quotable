import { useEffect } from "react";

const useGoogleAuth = store => {
    useEffect(() => {
        setTimeout(() => {
            gapi.load('auth2', async () => {
                const googleAuth = await gapi.auth2.init();

                const googleUser = googleAuth.currentUser.get();
                if (!googleUser.isSignedIn()) return;
                await store.onSignIn(googleUser);
            });
        }, 500);
    }, []);
};

export default useGoogleAuth;