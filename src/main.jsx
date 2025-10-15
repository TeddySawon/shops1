import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './css/Global.css';
import './css/header.css';

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);

