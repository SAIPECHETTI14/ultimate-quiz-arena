// FIREBASE IMPORTS

import { initializeApp }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

  getFirestore,

  collection,

  addDoc,

  getDocs,

  query,

  orderBy,

  limit

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// FIREBASE CONFIG

const firebaseConfig = {

  apiKey: "AIzaSyC_QRMDDe4XG2xEqpjqjTmKQBBpceejdpU",

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

const db =
  getFirestore(app);

// EXPORT

export {

  db,

  collection,

  addDoc,

  getDocs,

  query,

  orderBy,

  limit

};