import React from 'react'
import {createRoot} from 'react-dom/client'
import App from './App'
import {BrowserRouter as Router} from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"
import "react-toastify/dist/ReactToastify.min.css"
import './main.css'

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
      <Router>
      <App/>
    </Router>
)
