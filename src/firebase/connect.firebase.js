import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
const config = {
    apiKey: "AIzaSyBhTceEWqWaM2ZTahfMj98WWJlJYNbWCNU",
    authDomain: "alchemy-f82c5.firebaseapp.com",
    databaseURL: "https://alchemy-f82c5.firebaseio.com",
    projectId: "alchemy-f82c5",
    storageBucket: "alchemy-f82c5.appspot.com",
    messagingSenderId: "347840434380",
    appId: "1:347840434380:web:c21b5704876f35d61b7269",
    measurementId: "G-JBXSGZ27N7"
}
if (process.env.REACT_APP_ENV === 'local') {
    // Point to the RTDB emulator running on localhost.
    // In almost all cases the ns (namespace) is your project ID.
    config.databaseURL = "http://localhost:9000/?ns=alchemy-f82c5"
}
console.log(config);
firebase.initializeApp(config);

const db = firebase.firestore();

const auth = firebase.auth();
firebase.auth().useDeviceLanguage();
export { auth, db, firebase };

