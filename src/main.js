import { createApp } from "vue";
import App from "./App.vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
  collectionGroup,
  increment,
  where,
  query,
  getDocs,
  getDoc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGzgfofWOm734ophtTf4m3qlrv3IkfQZk",
  authDomain: "demonstrate-1d527.firebaseapp.com",
  projectId: "demonstrate-1d527",
  storageBucket: "demonstrate-1d527.appspot.com",
  messagingSenderId: "215318659251",
  appId: "1:215318659251:web:21635aec9246ba43b630c6",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const app = createApp(App);
app.component("QuillEditor", QuillEditor);
app.provide("db", db);
app.mount("#app");

export {
  db,
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  collectionGroup,
  increment,
  where,
  query,
  getDocs,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
};
