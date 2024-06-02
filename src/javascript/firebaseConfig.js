// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

export const firebaseConfig = {
  apiKey: 'AIzaSyCXMWjat9QVm-8cIMu7HDVVfO3DFJacoPg',
  authDomain: 'knapp-624ff.firebaseapp.com',
  databaseURL:
    'https://knapp-624ff-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'knapp-624ff',
  storageBucket: 'knapp-624ff.appspot.com',
  messagingSenderId: '640862278948',
  appId: '1:640862278948:web:41fb01a6a223c18810cfb1',
  measurementId: 'G-NTRKK91KZG'
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
