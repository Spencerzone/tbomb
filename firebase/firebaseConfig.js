// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyBPJIJa1SIIcXM-FF_rEhpkkKNByhOWRr0',
    authDomain: 'htadmin-66e28.firebaseapp.com',
    projectId: 'htadmin-66e28',
    storageBucket: 'htadmin-66e28.appspot.com',
    messagingSenderId: '131757094408',
    appId: '1:131757094408:web:45026445c72bc61e4cc3bd',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
