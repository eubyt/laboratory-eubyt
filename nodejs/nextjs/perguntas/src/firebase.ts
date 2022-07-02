import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GithubAuthProvider,
  User,
} from "firebase/auth";
import {
  collection,
  query,
  getDocs,
  getFirestore,
  addDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCK,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_APPID,
};

export const app = initializeApp(firebaseConfig);

// Github Login
const auth = getAuth();

const authProvider = new GithubAuthProvider();
authProvider.addScope("read:user");

type CurrentUserCallback = (user: User | null) => void;
export const currentUser = (callback: CurrentUserCallback) =>
  auth.onAuthStateChanged((user) => callback(user));

export const signIn = () =>
  signInWithPopup(auth, authProvider)
    .then((result) => {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      // The signed-in user info.
      const user = result.user;
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GithubAuthProvider.credentialFromError(error);
      // ...
    });

export const signOut = () => auth.signOut();

// Database
const db = getFirestore(app);

export const getAllQuestion = async () => {
  const q = query(collection(db, "question"));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
};

export const createQuestion = async (body: {
  title: string;
  userName: string;
  date: Timestamp;
  body: string;
}) => {
  await addDoc(collection(db, "question"), body);

};
