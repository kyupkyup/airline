import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { FirebaseProvider } from './context/Firebase';
import { UserProvider } from './context/User';
import { BrowserRouter as Router } from 'react-router-dom';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import CustomRouterProvider from './component/CustomRouter'
// import Auth from './page/Auth'
// import Moim from './page/Moim'
// import Write from './page/Moim/Write'
// import Account from './page/Account'
// import Specific from './page/Moim/Specific'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FirebaseProvider>
      <UserProvider>
        <Router>
          <App />
        </Router>
      </UserProvider>
    </FirebaseProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
