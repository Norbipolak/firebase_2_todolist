/*
Kell majd kettő dolgot beírni a terminálba
1. npm i firebase
2. npm i firestore

és akkor ide alá bemásoljuk, amit kell a firebase app csinálás közbeni dolgokat 
legalul pedig az app-ot exportáljuk, amiben ezek a firebaseConfig-es dolgok bent vannak
*/

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBl6jDEAAIY2ZPjCSG3Q_o8p_IVuFEb_aM",
  authDomain: "todolist-df260.firebaseapp.com",
  projectId: "todolist-df260",
  storageBucket: "todolist-df260.appspot.com",
  messagingSenderId: "253162793169",
  appId: "1:253162793169:web:b7ab83db1e52e474b07df0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default app;
export { db };

/*
ami nekünk kelleni fog az a forestore-os dolog 
és ezt felül majd be kell importálni -> 
import { getFirestore } from "firebase/firestore";

és még itt alul egy olyat, hogy const db = getFirestore(app);
amit majd importálunk is,  ilyen formában ->
export { db }; !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/ 