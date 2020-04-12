import React from 'react'
import fb from './../assets/imgs/fb.png'
import { auth, firebase } from '../firebase/connect.firebase';

const provider = new firebase.auth.FacebookAuthProvider();

export const fbSignUp = () => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        auth.signInWithPopup(provider).then(function (result) {
            console.log('logged in');
        }).catch(function (error) {
            console.log({ error });
        });
    } else {
        auth.signInWithRedirect(provider);
    }
}

export const FBLogin = () => {
    return (
        <button style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '3px',
            marginLeft: '-100px',
            width: '200px',
            height: '50px',
            border: 'transparent',
            borderRadius: 8,
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'transparent'

        }}
            onClick={fbSignUp}
        >
            <div style={{
                display: 'flex',
                alignItems: 'center',
            }}>

                <img style={{ width: 35 }} src={fb} alt="Login with Facebook" />
                <span style={{ marginLeft: 5 }}> Login with Facebook</span>
            </div>
        </button>
    )
}