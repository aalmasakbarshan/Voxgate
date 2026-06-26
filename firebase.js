import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  // PASTE YOUR CONFIG FROM STEP 16 HERE
  apiKey: "AIzaSyCvBOcEcUjNTUpca4AAUBl0bsez9yZ49qA",
  authDomain: "voxgate-60aa1.firebaseapp.com",
  databaseURL: "https://voxgate-60aa1-default-rtdb.firebaseio.com",
  projectId: "voxgate-60aa1",
  storageBucket: "voxgate-60aa1.firebasestorage.app",
  messagingSenderId: "672529198711",
  appId: "1:672529198711:web:cb2bc76fdea26b738ae072"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const CABIN_ID = "cabin_001";
