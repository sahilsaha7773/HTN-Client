import firebase from "firebase/app"
import 'firebase/auth';

const app = firebase.initializeApp({
  apiKey: "AIzaSyAm3ZmZQymUH4IZ6aVe72a2ADPL9b52MKo",
  authDomain: "project-htn-6d129.firebaseapp.com",
  projectId: "project-htn-6d129",
  storageBucket: "project-htn-6d129.appspot.com",
  messagingSenderId: "376072850807",
  appId: "1:376072850807:web:13b25942b583592a082572",
  measurementId: "G-G0QVJ840S8"
});
export const auth = app.auth()
export default app;