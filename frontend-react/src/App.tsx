import { useEffect, useState } from 'react';
import { fetchConfig } from './config';

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

  const getCurrentApiUrl = () => customApiUrl || defaultApiUrl;

  // Lädt API-URL aus Konfiguration
  const loadConfig = async () => {
    try {
      const config = await fetchConfig();
      setDefaultApiUrl(config.apiUrl);
      const stored = localStorage.getItem('apiUrl');
      setCustomApiUrl(stored || config.apiUrl);
      setConfigError(null);
    } catch (err) {
      setConfigError('Fehler beim Laden der Konfiguration');
      console.error(err);
    }
  };

  // Ruft Items vom Server ab
  const loadItems = async (url: string) => {
    try {
      const res = await fetch(`${url}/items`);
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
    localStorage.setItem('apiUrl', customApiUrl);
    await loadItems(customApiUrl);
  };

  // Zurücksetzen auf Standard-URL
  const resetUrl = async () => {
    localStorage.removeItem('apiUrl');
    setCustomApiUrl(defaultApiUrl);
    await loadItems(defaultApiUrl);
  };

  const addItem = async () => {
    try {
      await fetch(`${getCurrentApiUrl()}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, amount }),
      });
      setName('');
      setAmount(1);
      await loadItems(getCurrentApiUrl());
    } catch (err) {
      setConfigError('Fehler beim Hinzufügen des Items');
      console.error(err);
    }
  };

  const updateItem = async () => {
    try {
      await fetch(`${getCurrentApiUrl()}/items/${updateName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: updateAmount }),
      });
      setUpdateName('');
      setUpdateAmount(1);
      await loadItems(getCurrentApiUrl());
    } catch (err) {
      setConfigError('Fehler beim Aktualisieren des Items');
      console.error(err);
    }
  };

  const deleteItem = async () => {
    try {
      await fetch(`${getCurrentApiUrl()}/items/${deleteName}`, {
        method: 'DELETE',
      });
      setDeleteName('');
      await loadItems(getCurrentApiUrl());
    } catch (err) {
      setConfigError('Fehler beim Löschen des Items');
      console.error(err);
    }
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
      <header>Shopping List Manager</header>

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
                items.map(item => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.amount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h3>Add a New Item</h3>
          <form className="formx" onSubmit={e => e.preventDefault()}>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
            <input type="number" value={amount} onChange={e => setAmount(+e.target.value)} placeholder="Amount" required />
            <button onClick={addItem} type="button">Add Item</button>
          </form>

          <h3>Update Item</h3>
          <form className="formx" onSubmit={e => e.preventDefault()}>
            <input type="text" value={updateName} onChange={e => setUpdateName(e.target.value)} placeholder="Name" required />
            <input type="number" value={updateAmount} onChange={e => setUpdateAmount(+e.target.value)} placeholder="Amount" required />
            <button onClick={updateItem} type="button">Update Item</button>
          </form>

          <h3>Delete Item</h3>
          <form className="formx" onSubmit={e => e.preventDefault()}>
            <input type="text" value={deleteName} onChange={e => setDeleteName(e.target.value)} placeholder="Name" required />
            <button onClick={deleteItem} type="button">Delete Item</button>
          </form>
        </div>

        <div className="config-box">
          <h4>⚙️ Konfiguration</h4>

          <label htmlFor="api-url-input">Manuelle API-URL:</label>
          <input
            id="api-url-input"
            type="text"
            value={customApiUrl}
            onChange={e => setCustomApiUrl(e.target.value)}
            placeholder="https://example.com"
          />

          <button onClick={applyCustomUrl}>Anwenden</button>
          <button onClick={resetUrl}>🔄 Standard-Konfiguration laden</button>

          <p className="api-status">
            Aktive API: {getCurrentApiUrl() || 'nicht geladen'}{' '}
            {(!getCurrentApiUrl() || configError) && <span style={{ color: 'red' }}>⚠️</span>}
          </p>
        </div>
      </div>

      <footer>
        <p>&copy; Parallel Systems Study Project by Philipp Schlosser.</p>
      </footer>
    </>
  );
}

export default App;
