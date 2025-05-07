import { useEffect, useState } from 'react';
import { getConfig } from './config';

type Item = {
  name: string;
  amount: number;
};

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number>(1);
  const [updateName, setUpdateName] = useState('');
  const [updateAmount, setUpdateAmount] = useState<number>(1);
  const [deleteName, setDeleteName] = useState('');
  const { apiUrl } = getConfig();

  const loadItems = async () => {
    const res = await fetch(`${apiUrl}/items`);
    const data = await res.json();
    setItems(data);
  };

  const addItem = async () => {
    await fetch(`${apiUrl}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, amount }),
    });
    setName('');
    setAmount(1);
    loadItems();
  };

  const updateItem = async () => {
    await fetch(`${apiUrl}/items/${updateName}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: updateAmount }),
    });
    setUpdateName('');
    setUpdateAmount(1);
    loadItems();
  };

  const deleteItem = async () => {
    await fetch(`${apiUrl}/items/${deleteName}`, {
      method: 'DELETE',
    });
    setDeleteName('');
    loadItems();
  };

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <>
      <header>
        Shopping List Manager
      </header>

      <div className="container">
        <h3>All Shopping Items</h3>
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Add a New Item</h3>
        <form className="formx" onSubmit={e => e.preventDefault()}>
          <input id="item-name" type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
          <input id="item-amount" type="number" placeholder="Amount" value={amount} onChange={e => setAmount(+e.target.value)} required />
          <button type="button" id="add-item-button" onClick={addItem}>Add Item</button>
        </form>

        <h3>Update Item</h3>
        <form className="formx" onSubmit={e => e.preventDefault()}>
          <input id="update-name" type="text" placeholder="Name of item to update" value={updateName} onChange={e => setUpdateName(e.target.value)} required />
          <input id="update-amount" type="number" placeholder="New amount" value={updateAmount} onChange={e => setUpdateAmount(+e.target.value)} required />
          <button type="button" id="update-item-button" onClick={updateItem}>Update Item</button>
        </form>

        <h3>Delete Item</h3>
        <form className="formx" onSubmit={e => e.preventDefault()}>
          <input id="delete-name" type="text" placeholder="Name of item to delete" value={deleteName} onChange={e => setDeleteName(e.target.value)} required />
          <button type="button" id="delete-item-button" onClick={deleteItem}>Delete Item</button>
        </form>
      </div>

      <footer>
        <p>&copy; Parallel Sytems Study Project by Philipp Schlosser.</p>
      </footer>
    </>
  );
}

export default App;