import { useEffect, useState } from 'react';
import { fetchConfig } from './config';
import reactLogo from './assets/react_icon.svg';
import { FaSun, FaMoon } from 'react-icons/fa';

type Item = { name: string; amount: number };

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number>(1);
  const [updateName, setUpdateName] = useState('');
  const [updateAmount, setUpdateAmount] = useState<number>(1);
  const [deleteName, setDeleteName] = useState('');
  const [defaultApiUrl, setDefaultApiUrl] = useState<string>('');
  const [customApiUrl, setCustomApiUrl] = useState<string>('');
  const [configError, setConfigError] = useState<string | null>(null);
  const [manualApiInput, setManualApiInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Hilfsfunktion, entfernt alle Slashes am Ende
  const cleanUrl = (url: string) => url.trim().replace(/\/+$/, '');

  const getCurrentApiUrl = () => cleanUrl(customApiUrl || defaultApiUrl);

  // Lädt API-URL aus Konfiguration
  const loadConfig = async () => {
    try {
      const config = await fetchConfig();
      setDefaultApiUrl(cleanUrl(config.apiUrl));
      const stored = localStorage.getItem('apiUrl');

      if (stored) {
        setCustomApiUrl(cleanUrl(stored));
      }

      setConfigError(null);
    } catch (err) {
      setConfigError('Fehler beim Laden der Konfiguration');
      console.error(err);
    }
  };

  // Ruft Items vom Server ab
  const loadItems = async (url: string) => {
    try {
      const cleanApiUrl = cleanUrl(url);
      const res = await fetch(`${cleanApiUrl}/items`);
      const data = await res.json();
      setItems(data);
      setConfigError(null);
    } catch (err) {
      setItems([]); // Liste leeren bei Fehler
      setConfigError('Fehler beim Laden der Items');
      console.error(err);
    }
  };

  // URL speichern und Daten neu laden
  const applyCustomUrl = async () => {
    const cleanInput = cleanUrl(manualApiInput);
    localStorage.setItem('apiUrl', cleanInput);
    setCustomApiUrl(cleanInput);
    await loadItems(cleanInput);
  };

  // Zurücksetzen auf Standard-URL
  const resetUrl = async () => {
    localStorage.removeItem('apiUrl');
    setCustomApiUrl(defaultApiUrl);
    setManualApiInput('');
    await loadItems(defaultApiUrl);
  };

  const addItem = async () => {
    try {
      const cleanApiUrl = getCurrentApiUrl();
      await fetch(`${cleanApiUrl}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, amount }),
      });
      setName('');
      setAmount(1);
      await loadItems(cleanApiUrl);
    } catch (err) {
      setConfigError('Fehler beim Hinzufügen des Items');
      console.error(err);
    }
  };

  const updateItem = async () => {
    try {
      const cleanApiUrl = getCurrentApiUrl();
      await fetch(`${cleanApiUrl}/items/${updateName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: updateAmount }),
      });
      setUpdateName('');
      setUpdateAmount(1);
      await loadItems(cleanApiUrl);
    } catch (err) {
      setConfigError('Fehler beim Aktualisieren des Items');
      console.error(err);
    }
  };

  const deleteItem = async () => {
    try {
      const cleanApiUrl = getCurrentApiUrl();
      await fetch(`${cleanApiUrl}/items/${deleteName}`, {
        method: 'DELETE',
      });
      setDeleteName('');
      await loadItems(cleanApiUrl);
    } catch (err) {
      setConfigError('Fehler beim Löschen des Items');
      console.error(err);
    }
  };

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    (async () => {
      await loadConfig();
      const url = localStorage.getItem('apiUrl') || defaultApiUrl;
      if (url) await loadItems(url);
    })();
  }, []);

  return (
    <>
      <header className="app-header">
        <span>Shopping List Manager</span>
        <img src={reactLogo} alt="React logo" className="header-logo" />
        <button className="darkmode-toggle" onClick={toggleDarkMode}>
          {isDarkMode ? <FaSun className="icon-sun" /> : <FaMoon className="icon-moon" />}
        </button>
      </header>

      <div className="main-wrapper">
        <div className="container">
          {configError && <p className="error">{configError}</p>}

          <h3>All Shopping Items</h3>
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={2} style={{ textAlign: 'center', opacity: 0.6 }}>
                    Keine Items geladen
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.amount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h3>Add a New Item</h3>
          <form className="formx" onSubmit={(e) => e.preventDefault()}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(+e.target.value)}
              placeholder="Amount"
              required
            />
            <button onClick={addItem} type="button">
              Add Item
            </button>
          </form>

          <h3>Update Item</h3>
          <form className="formx" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              value={updateName}
              onChange={(e) => setUpdateName(e.target.value)}
              placeholder="Name"
              required
            />
            <input
              type="number"
              value={updateAmount}
              onChange={(e) => setUpdateAmount(+e.target.value)}
              placeholder="Amount"
              required
            />
            <button onClick={updateItem} type="button">
              Update Item
            </button>
          </form>

          <h3>Delete Item</h3>
          <form className="formx" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              value={deleteName}
              onChange={(e) => setDeleteName(e.target.value)}
              placeholder="Name"
              required
            />
            <button onClick={deleteItem} type="button">
              Delete Item
            </button>
          </form>
        </div>

        <div className="right-wrapper">
          <div className="config-box">
            <h4>⚙️ Konfiguration</h4>
            <label htmlFor="api-url-input">Manuelle API-URL:</label>
            <input
              id="api-url-input"
              type="text"
              value={manualApiInput}
              onChange={(e) => setManualApiInput(e.target.value)}
              placeholder="https://example.com"
            />
            <button onClick={applyCustomUrl}>Anwenden</button>
            <button onClick={resetUrl}>🔄 Standard-Konfiguration laden</button>
            <p className="api-status">
              Aktive API: {getCurrentApiUrl() || 'nicht geladen'}{' '}
              {(!getCurrentApiUrl() || configError) && <span style={{ color: 'red' }}>⚠️</span>}
            </p>
          </div>
          <div className="info-box">
            <h4>🔌 Backend-Instanzen</h4>
            <ul>
              <li>
                <strong>Backend A:</strong> <code>Port 5000</code>
                <button
                  className={`backend-switch ${getCurrentApiUrl().includes('5000') ? 'active' : ''}`}
                  onClick={async () => {
                    const hostname = window.location.hostname;
                    const newUrl = `https://${hostname.replace('-6000', '-5000')}`;
                    const cleanUrlInput = cleanUrl(newUrl);
                    setCustomApiUrl(cleanUrlInput);
                    localStorage.setItem('apiUrl', cleanUrlInput);
                    await loadItems(cleanUrlInput);
                  }}
                >
                  {getCurrentApiUrl().includes('5000') ? 'Aktiv' : 'Verbinden mit Backend A'}
                </button>
              </li>
              <li>
                <strong>Backend B:</strong> <code>Port 5001</code>
                <button
                  className={`backend-switch ${getCurrentApiUrl().includes('5001') ? 'active' : ''}`}
                  onClick={async () => {
                    const hostname = window.location.hostname;
                    const newUrl = `https://${hostname.replace('-6000', '-5001')}`;
                    const cleanUrlInput = cleanUrl(newUrl);
                    setCustomApiUrl(cleanUrlInput);
                    localStorage.setItem('apiUrl', cleanUrlInput);
                    await loadItems(cleanUrlInput);
                  }}
                >
                  {getCurrentApiUrl().includes('5001') ? 'Aktiv' : 'Verbinden mit Backend B'}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <footer>
        <p>&copy; Parallel Systems Study Project by Philipp Schlosser</p>
      </footer>
    </>
  );
}

export default App;
