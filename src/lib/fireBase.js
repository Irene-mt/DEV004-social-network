import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  setDoc,
  doc,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  updateDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAOUeeD-y4TUdhaBdt5fG6ZEmSTthslbGI',
  authDomain: 'home-helpers-74055.firebaseapp.com',
  projectId: 'home-helpers-74055',
  storageBucket: 'home-helpers-74055.appspot.com',
  messagingSenderId: '914508630139',
  appId: '1:914508630139:web:5ca89311430a8e95993ade',
  measurementId: 'G-XJVC9T7JX1',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const db2 = getFirestore();

// Guarda colección de usuarios en firestore
const saveUser = (displayName, email, password, date, uid) => {
  setDoc(doc(db2, 'users', uid), {
    displayName,
    email,
    password,
    date,
    uid,
  });
};
// Registra y crea el usuario con email y contraseña
// eslint-disable-next-line
export const createUser = (email, password, displayName, date) => {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((usercredentials) => {
      const user = usercredentials.user;
      saveUser(displayName, email, password, date, user.uid);
      return user;
    });
};

// Iniciar sesión
export const logIn = (email, password) => signInWithEmailAndPassword(auth, email, password);

// Iniciar sesión con Google
// eslint-disable-next-line
export const logInGoogle = () => {
  return signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      return { user, token };
    });
};

// Encuentra si hay usuario conectado
export function authStateChangedEvent(cb) {
  onAuthStateChanged(auth, (user) => cb(user));
}

// Cerrar sesión
export const signOutUser = () => signOut(auth);

// Contador de likes
export const likes = [];

// Crea la colección de posts
// eslint-disable-next-line
export const createPost = (post, ownerPost) => {
  return addDoc(collection(db, 'post'), {
    post,
    ownerPost,
    photo: auth.currentUser.photoURL,
    createDate: serverTimestamp(),
    id: auth.currentUser.uid,
    likes,
  });
};
// Da instrucciones para mostrar los post
export const queryInstruction = () => query((collection(db, 'post')), orderBy('createDate', 'desc'));

// Encuentra y muestra los post
export const onGetPosts = () => {
  const post = [];
  onSnapshot(queryInstruction(), (array) => {
    array.forEach((allPosts) => {
      post.push(allPosts.data());
    });
  });
  return post;
};
// Elimina post
export const deletePost = (id) => deleteDoc(doc(db, 'post', id));

// Obtiene la información de los post
export const getPost = (id) => getDoc(doc(db, 'post', id));

// Actualiza la información de los post
export const updatePost = (id, editedPost) => updateDoc(doc(db, 'post', id), editedPost);

// Da like y dislike a los post
export const toLike = (id, uid) => updateDoc(doc(db, 'post', id), {
  likes: arrayUnion(uid),
});

export const toDislike = (id, uid) => updateDoc(doc(db, 'post', id), {
  likes: arrayRemove(uid),
});
