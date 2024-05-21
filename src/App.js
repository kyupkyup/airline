import './App.css';
import { useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch, useNavigate } from 'react-router-dom';
import { useFirebaseContext } from './context/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useUserContext } from './context/User';

function App() {
  const navigate = useNavigate();

  const naviagteMoim = () => {
    navigate('/moim')
  }
  const naviagteAccount = () => {
    navigate('/account')
  }


  return <>
    app
    ㅁㄴㅇㄹ
    <button onClick={naviagteMoim}> 모임</button>
    <button onClick={naviagteAccount}>계정</button>

  </>;
}

export default App;
