// Firebase Configuration
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL, uploadBytes } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// DB Utils
export async function saveToDB(key, value) {
    try {
        await setDoc(doc(db, "siteSettings", key), value);
        console.log("Document successfully written!");
    } catch (e) {
        console.error("Error writing document: ", e);
        throw e;
    }
}

export async function loadFromDB(key) {
    const docRef = doc(db, "siteSettings", key);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log("No such document!");
        return null;
    }
}

// Storage Utils
export async function uploadImageToStorage(fileOrDataUrl, path) {
    const storageRef = ref(storage, path);

    try {
        if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
            // It's a data URL
            await uploadString(storageRef, fileOrDataUrl, 'data_url');
        } else {
            // It's a File or Blob
            await uploadBytes(storageRef, fileOrDataUrl);
        }
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (error) {
        console.error("Upload failed", error);
        throw error;
    }
}
