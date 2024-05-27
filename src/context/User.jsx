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

    const refreshUser = () => {
        setUser(
            {
                uid: '',
                displayName: '',
                email: '',
                photoUrl: '',
                buyIn: 0,
                usedBuyIn: 0,
                earnedBuyIn: 0,
                attend: 0,
                userName: '',
                rank: {
                    first: 0,
                    second: 0,
                    third: 0,
                    fourth: 0,
                }
            }
        )
    }

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // 사용자가 로그인 상태임
                const db = getFirestore();
                const currentUser = auth.currentUser;

                const docRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUser(
                        // {
                        //     uid: currentUser.uid,
                        //     displayName: currentUser.displayName,
                        //     email: currentUser.email,
                        //     photoUrl: currentUser.photoURL,
                        //     buyIn: docSnap.data().buyIn,
                        //     usedBuyIn: docSnap.data().usedBuyIn,
                        //     earnedBuyIn: docSnap.data().earnedBuyIn,
                        //     attend: docSnap.data().attend,
                        //     userName: docSnap.data().userName,
                        //     rank: {
                        //         first: docSnap.data().rank.first,
                        //         second: docSnap.data().rank.second,
                        //         third: docSnap.data().rank.third,
                        //         fourth: docSnap.data().rank.fourth,
                        //     }
                        // }
                        {
                            uid:'x2T4EviNu0c0E75uvM3rycM4V1q1',
                                                    email: currentUser.email,
                            photoUrl: "https://lh3.googleusercontent.com/a/ACg8ocLNjZv7oj_8JA46PltO2G0GJulBLRtgzcLrWD55trpMuqolk8AQ=s96-c",
                            attend:0,
                            buyIn:21,
                            earnedBuyIn:          0,
                            rank: {
                            first:     0,
                            fourth:      0,
                            second:       0,
                            third:       0,
                        },
                            usedBuyIn:   4,
                            userName:   "김아림"
                        }
                    )
                }
            } else {
                setUser(null)
            }
        })
    }, [])

    return {
        user,
        setUser,
        usageBuyIn,
        refreshUser
    }
}

// Context Provider 컴포넌트
export const UserProvider = ({ children }) => {
    const { user, setUser, usageBuyIn, refreshUser } = useUser();

    return (
        <UserContext.Provider value={{ user, setUser, usageBuyIn, refreshUser }}>
            {children}
        </UserContext.Provider>
    );
};

// 사용자 정의 Hook
export const useUserContext = () => useContext(UserContext);

export default UserContext;
