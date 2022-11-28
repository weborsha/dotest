import React from "react";
import ReactDOM from "react-dom/client";
import './css/style.css';
import {Dapp} from "./components/Dapp";
import App from './App';

// We import bootstrap here, but you can remove if you want
import "bootstrap/dist/css/bootstrap.css";

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.

// ReactDOM.render(
//   <React.StrictMode>
//     <Dapp />
//   </React.StrictMode>,
//   document.getElementById("root")
// );

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    //<React.StrictMode>
    <App/>
    //</React.StrictMode>
);

//reportWebVitals();