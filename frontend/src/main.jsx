import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.jsx'


const el = document.getElementById('root');
const root = ReactDOM.createRoot(el);

root.render(<App />);