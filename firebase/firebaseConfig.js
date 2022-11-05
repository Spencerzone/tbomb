// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: 'AIzaSyCXEsW6aSxphTVkucsQPvEAOitGZP1Lqu0',
    authDomain: 'tbomb-58bb4.firebaseapp.com',
    projectId: 'tbomb-58bb4',
    storageBucket: 'tbomb-58bb4.appspot.com',
    messagingSenderId: '592095898794',
    appId: '1:592095898794:web:01eeb575be623cd117b4d3',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

//
