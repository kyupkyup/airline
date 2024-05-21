import { GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useFirebaseContext } from '../context/Firebase';
import { useUserContext } from '../context/User';
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
    const { db, auth } = useFirebaseContext();
    const { setUser } = useUserContext();
    const navigate = useNavigate();


    const login = () => {
        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        auth.useDeviceLanguage();

        signInWithPopup(auth, provider)
            .then(async (result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                // The signed-in user info.
                const user = result.user;

                try {
                    await setPersistence(auth, browserLocalPersistence);

                    const docRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(docRef);

                    if (!docSnap.exists()) {
                        // 문서가 존재하지 않으면 새로 추가합니다.
                        await setDoc(docRef, { buyIn: 0 });
                    }
                    setUser({
                        uid: user.uid,
                        displayName: user.displayName,
                        email: user.email,
                        photoUrl: user.photoURL,
                        buyIn: docSnap.data().buyIn
                    })
                    navigate('/')
                } catch (error) {
                    console.error("Error adding document: ", error);
                }


                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
                console.error(errorCode, 'errorCode')
                console.error(errorMessage, 'errorMessage')
                console.error(email, 'email')
                console.error(credential, 'credential')
            });
    }

    return <>
        <a href="#" className="google-btn" onClick={login}>
            <div className="google-icon-wrapper">
                <img className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png?20230822192911" alt="구글 로고" />
            </div>
            <p className="btn-text"><b>구글로 로그인</b></p>
        </a>
    </>
}

export default AuthPage;