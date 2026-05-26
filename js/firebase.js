// FIREBASE APP

import {

  initializeApp

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


// FIREBASE AUTH

import {

  getAuth,

  createUserWithEmailAndPassword,

  signInWithEmailAndPassword,

  signOut,

  onAuthStateChanged,

  GoogleAuthProvider,

  signInWithPopup,

  sendEmailVerification,

  sendPasswordResetEmail,

  updateProfile

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// FIRESTORE

import {

  getFirestore,

  collection,

  addDoc,

  getDocs,

  query,

  orderBy,

  limit,

  updateDoc,

  setDoc,

  getDoc,

  doc,

  serverTimestamp

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// CONFIG

const firebaseConfig = {

  apiKey:
    "AIzaSyC_QRMDDe4XG2xEqpjqjTmKQBBpceejdpU",

  authDomain:
    "ultimate-quiz-arena-44238.firebaseapp.com",

  projectId:
    "ultimate-quiz-arena-44238",

  storageBucket:
    "ultimate-quiz-arena-44238.firebasestorage.app",

  messagingSenderId:
    "724056834506",

  appId:
    "1:724056834506:web:c4975aaea5fe7f0ff5cf33"

};


// INITIALIZE

const app =
  initializeApp(firebaseConfig);


// AUTH

const auth =
  getAuth(app);


// FIRESTORE

const db =
  getFirestore(app);


// GOOGLE PROVIDER

const provider =
  new GoogleAuthProvider();


// EXPORTS

export {

  auth,

  db,

  provider,

  collection,

  addDoc,

  getDocs,

  query,

  orderBy,

  limit,

  updateDoc,

  setDoc,

  getDoc,

  doc,

  serverTimestamp,

  createUserWithEmailAndPassword,

  signInWithEmailAndPassword,

  signOut,

  onAuthStateChanged,

  GoogleAuthProvider,

  signInWithPopup,

  sendEmailVerification,

  sendPasswordResetEmail,

  updateProfile

};
