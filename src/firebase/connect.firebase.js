import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

firebase.initializeApp({
    apiKey: "AIzaSyBhTceEWqWaM2ZTahfMj98WWJlJYNbWCNU",
    authDomain: "alchemy-f82c5.firebaseapp.com",
    databaseURL: "https://alchemy-f82c5.firebaseio.com",
    projectId: "alchemy-f82c5",
    storageBucket: "alchemy-f82c5.appspot.com",
    messagingSenderId: "347840434380",
    appId: "1:347840434380:web:c21b5704876f35d61b7269",
    measurementId: "G-JBXSGZ27N7"
});

const db = firebase.database();

const auth = firebase.auth();

export { auth, db, firebase };

