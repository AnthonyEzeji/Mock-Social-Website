import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyByPLOIAYOUBUP93ocUcicQGJcHlB2jTiw",
    authDomain: "messenger-app-9390a.firebaseapp.com",
    projectId: "messenger-app-9390a",
    storageBucket: "messenger-app-9390a.appspot.com",
    messagingSenderId: "772470221430",
    appId: "1:772470221430:web:4df6bf3d475d000432cd57"
};
const app = initializeApp(firebaseConfig);


export const db = getFirestore(app)