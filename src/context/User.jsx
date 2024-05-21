import { useContext, createContext, useState, useEffect } from "react";
import { doc, getDoc } from 'firebase/firestore';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const UserContext = createContext();

const useUser = () => {
    const [user, setUser] = useState();
    const auth = getAuth();

    const usageBuyIn = (tickets) => {
        setUser({
            ...user, buyIn: user.buyIn - tickets
        })
    }

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // 사용자가 로그인 상태임
                const db = getFirestore();
                const currentUser = auth.currentUser;

                const docRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(docRef);
                setUser(
                    {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        email: currentUser.email,
                        photoUrl: currentUser.photoURL,
                        buyIn: docSnap.data().buyIn
                    }
                )
            } else {
                setUser(null)            // 사용자가 로그인하지 않음
            }
        })
    }, [])

    return {
        user,
        setUser,
        usageBuyIn
    }
}

// Context Provider 컴포넌트
export const UserProvider = ({ children }) => {
    const { user, setUser, usageBuyIn } = useUser();

    return (
        <UserContext.Provider value={{ user, setUser, usageBuyIn }}>
            {children}
        </UserContext.Provider>
    );
};

// 사용자 정의 Hook
export const useUserContext = () => useContext(UserContext);

export default UserContext;