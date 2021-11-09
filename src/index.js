import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './fonts.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store'
import {Provider} from 'react-redux';
//import {fetchStars} from './features/stars/starsSlice';
import makeServer from './api/server'
import makeFinalServer from './api/server'
/* 
if (process.env.NODE_ENV === "development" && typeof makeServer === "function") {
  makeServer(); //
} else if (process.env.NODE_ENV === "production" || process.env.REACT_APP_DEMO) {
  makeFinalServer(); //
} */
console.log = function() {}

ReactDOM.render (
  <React.StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
