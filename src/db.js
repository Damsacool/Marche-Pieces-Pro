import Dexie from 'dexie';

export const db = new Dexie('marche_pieces_pro');
db.version(1).stores({
  categories: '++id, name',
  items: '++id, name, categoryId, price, stockQty'
});

export async function addCategory(name) {
  if(!name) throw new Error('Name required');
  return db.categories.add({ name: name.trim() });
}

export function listCategories() {
  return db.categories.orderBy('name').toArray();
}

export async function addItem({ name, categoryId=null, price=0, stockQty=0 }) {
  if(!name) throw new Error('Item name required');
  return db.items.add({ 
    name: name.trim(), 
    categoryId, 
    price: Number(price)||0, 
    stockQty: Number(stockQty)||0 
  });
}

export function listItems() {
  return db.items.toArray();
}

export async function deleteCategory(id) {
  const itemsInCat = await db.items.where('categoryId').equals(id).count();
  if(itemsInCat > 0) {
    throw new Error(`Cannot delete: ${itemsInCat} item(s) still in this category`);
  }
  return db.categories.delete(id);
}

export async function deleteItem(id) {
  return db.items.delete(id);
}