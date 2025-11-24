import React, { useEffect, useState } from 'react';
import { addCategory, listCategories, addItem, listItems, deleteCategory, deleteItem } from '../db';

export default function Stock() {
  const [catName, setCatName] = useState('');
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);

  // Item form state
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemStock, setItemStock] = useState('');
  const [itemCategoryId, setItemCategoryId] = useState(''); // '' means standalone

  async function refresh() {
    setCategories(await listCategories());
    setItems(await listItems());
  }
  useEffect(()=>{ refresh(); }, []);

  async function saveCategory(e) {
    e.preventDefault();
    try {
      await addCategory(catName);
      setCatName('');
      refresh();
    } catch(err) {
      alert(err.message);
    }
  }

  async function saveItem(e) {
    e.preventDefault();
    try {
      await addItem({
        name: itemName,
        categoryId: itemCategoryId === '' ? null : Number(itemCategoryId),
        price: itemPrice,
        stockQty: itemStock
      });
      setItemName(''); setItemPrice(''); setItemStock(''); setItemCategoryId('');
      refresh();
    } catch(err) {
      alert(err.message);
    }
  }

  async function handleDeleteItem(id) {
    if(!confirm('Delete this item?')) return;
    try {
      await deleteItem(id);
      refresh();
    } catch(err) {
      alert(err.message);
    }
  }

  async function handleDeleteCategory(id) {
    if(!confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      refresh();
    } catch(err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h2>Stock</h2>

      <form onSubmit={saveCategory} style={{marginBottom:'16px'}}>
        <h3>Ajouter Catégorie</h3>
        <input value={catName} onChange={e=>setCatName(e.target.value)} placeholder="Nom catégorie (ex: Ampoule)" />
        <button>Ajouter</button>
      </form>

      <div style={{marginBottom:'24px'}}>
        <h3>Catégories</h3>
        {categories.length === 0 && <div>Aucune catégorie</div>}
        <ul>
          {categories.map(c=> (
            <li key={c.id}> {c.name} 
      <button onClick={()=>handleDeleteCategory(c.id)} style={{marginLeft:'8px'}}>❌</button>
    </li>
            ))}
        </ul>
      </div>

      <form onSubmit={saveItem} style={{marginBottom:'16px'}}>
        <h3>Ajouter Article</h3>
        <input value={itemName} onChange={e=>setItemName(e.target.value)} placeholder="Nom article (ex: H4)" />
        <input value={itemPrice} onChange={e=>setItemPrice(e.target.value)} placeholder="Prix" inputMode="numeric" />
        <input value={itemStock} onChange={e=>setItemStock(e.target.value)} placeholder="Stock" inputMode="numeric" />
        <select value={itemCategoryId} onChange={e=>setItemCategoryId(e.target.value)}>
          <option value="">(Standalone / Solo)</option>
          {categories.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button>Ajouter Article</button>
      </form>

      <div>
        <h3>Articles</h3>
        {items.length === 0 && <div>Aucun article</div>}
        <ul>
        {items.map(it=>{
          const cat = categories.find(c=>c.id === it.categoryId);
            return (
          <li key={it.id}>
          {it.name} — {it.price} CFA — Stock: {it.stockQty} — {cat? cat.name : '(Solo)'} 
        <button onClick={()=>handleDeleteItem(it.id)} style={{marginLeft:'8px'}}>❌</button>
        </li>
              );
          })}
      </ul>
    </div>
  </div>
);
}