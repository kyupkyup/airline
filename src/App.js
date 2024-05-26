import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation, Link, useNavigate } from 'react-router-dom';
import Moim from './page/Moim'
import Account from "./page/Account";
import Auth from "./page/Auth";
import Name from "./page/Auth/Name";
import Update from "./page/Moim/Write/Update";
import Write from "./page/Moim/Write";
import Specific from "./page/Moim/Specific";
import { useUserContext } from './context/User';
import { useEffect } from 'react';




function App() {
  const { user } = useUserContext();
  console.log(user)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/auth')
    }
    else {
      navigate('/')
    }
  }, [user])

  const NavButton = ({ to, children }) => {
    const { pathname } = useLocation();
    console.log(pathname, to)

    return (
      <button disabled={pathname === to || (pathname.includes('moim') && to === '/')} className="nav-btn" >
        <Link to={to}>{children}</Link>
      </button>
    );
  };

  return <>
    <div className="container">
      <nav>
        {user &&
          <ul>
            <li>
              <NavButton to="/">모임</NavButton>
            </li>
            <li>
              <NavButton to="/account">계정</NavButton>
            </li>
          </ul>
        }
      </nav>
      <Routes>

        <Route path="/" element={<Moim />} />
        <Route path="/account" element={<Account />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/name" element={<Name />} />
        <Route path="/moim/write" element={<Write />} />
        <Route path="/moim/:id" element={<Specific />} />
        <Route path="/moim/update/:id" element={<Update />} />

        {/*<Route path="/">*/}
        {/*  <Home />*/}
        {/*</Route>*/}
      </Routes>
    </div>
    {/*<button onClick={naviagteMoim}> 모임</button>*/}
    {/*<button onClick={naviagteAccount}>계정</button>*/}

  </>;
}

export default App;
