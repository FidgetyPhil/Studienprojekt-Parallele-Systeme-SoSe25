import * as ReactDOM from 'react-dom/client';
import App from './App';
import { loadConfig } from './config';
import './index.css';

loadConfig()
  .then(() => {
    const root = ReactDOM.createRoot(document.getElementById('root')!);
    root.render(<App />);
  })
  .catch(err => {
    document.body.innerHTML = '<h2>Fehler beim Laden der Konfiguration</h2>';
    console.error(err);
  });
