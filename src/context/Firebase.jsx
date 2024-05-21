import { useContext, createContext } from "react";
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const FirebaseContext = createContext();

const useFirebase = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyCZg4BWBIPT8P-YzZOTi3AIWyTRQPFcKdU",
        authDomain: "airline-d96b7.firebaseapp.com",
        projectId: "airline-d96b7",
        storageBucket: "airline-d96b7.appspot.com",
        messagingSenderId: "203061671157",
        appId: "1:203061671157:web:66af922c1ebc375c89c1bc",
        measurementId: "G-JWH8M73B5E"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const db = getFirestore(app);
    const auth = getAuth(app);

    return {
        app,
        auth,
        analytics,
        db
    }
}
// Context Provider 컴포넌트
export const FirebaseProvider = ({ children }) => {
    const { app, auth, analytics, db } = useFirebase();

    return (
        <FirebaseContext.Provider value={{ app, analytics, auth, db }}>
            {children}
        </FirebaseContext.Provider>
    );
};

// 사용자 정의 Hook
export const useFirebaseContext = () => useContext(FirebaseContext);

export default FirebaseContext;