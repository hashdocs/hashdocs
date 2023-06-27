// components/GoogleSignIn.js
import { useEffect } from 'react';
import Script from 'next/script';

function GoogleSignIn({ handleSignInWithGoogle }: any) {
    useEffect(() => {
        //@ts-ignore
        window.handleSignInWithGoogle = handleSignInWithGoogle;
    }, [handleSignInWithGoogle]);

    return (
        <>
            <Script
                src="https://accounts.google.com/gsi/client"
                strategy="beforeInteractive"
            />

            <div
                id="g_id_onload"
                data-client_id="274576635618-0s6ola782ltn4idc3toi3tu622j1ulbr.apps.googleusercontent.com"
                data-context="signin"
                data-ux_mode="popup"
                data-callback="handleSignInWithGoogle"
                data-auto_prompt="false"
            />

            <div
                className="g_id_signin"
                data-type="standard"
                data-shape="rectangular"
                data-theme="outline"
                data-text="signin_with"
                data-size="large"
                data-logo_alignment="left"
            />
        </>
    );
}

export default GoogleSignIn;
