# Marché Pièces Pro — AI Agent Instructions

## Project Overview
Offline-first PWA for spare parts inventory management in Abidjan markets. Built for low-literacy users with image-based UI, French labels, and Mobile Money support. React + Vite + Dexie (IndexedDB).

## Architecture

### Data Layer (`src/db.js`)
- **Dexie wrapper** for IndexedDB with schema version 1
- Current tables: `categories` (id, name), `items` (id, name, categoryId, price, stockQty)
- All DB functions are async and return Promises
- Pattern: Export named functions (e.g., `addCategory`, `listItems`) not class methods
- **Known typo in db.js**: Line 36 has `itemsInCat > o` (should be `0`), and wrong variable name `itemsIncat` (should be `itemsInCat`)

### Component Structure
- **App.jsx**: BrowserRouter root with NavLink navigation and Routes
- **Pages**: Live in `src/pages/` — currently Dashboard (placeholder) and Stock (full CRUD)
- **No component library**: Pure React with inline styles + `style.css` global stylesheet

### Routing
- React Router v6 (`react-router-dom`)
- Routes: `/` (Dashboard), `/stock` (Stock management)
- Navigation uses `<NavLink>` for active state styling (`.active` CSS class)

## Development Patterns

### State Management
- **Local useState + useEffect** pattern — no Redux/Context yet
- `Stock.jsx` pattern: Load data with `refresh()` on mount, call after mutations
- Form state: Controlled inputs with individual useState per field
- Async error handling: Try-catch with `alert()` for user feedback

### Database Operations
```javascript
// Standard pattern
async function saveItem() {
  try {
    await addItem({ name, categoryId, price, stockQty });
    clearForm();
    refresh(); // Reload data from IndexedDB
  } catch(err) {
    alert(err.message);
  }
}
```

### Form Handling
- Prevent default with `e.preventDefault()`
- Clear inputs after successful save
- Numeric inputs use `inputMode="numeric"` attribute
- Validation in db functions (throw Error if invalid)

## Styling Conventions

### CSS Variables (`:root`)
- `--primary: #0a7` (green for success/actions)
- `--danger: #d32f2f` (red for delete/alerts)
- `--bg: #f5f5f5` (light gray background)
- `--text: #212121` (dark text)

### Component Styling
- Prefer inline styles for one-offs: `style={{marginBottom:'16px'}}`
- Global styles in `style.css` for common elements (button, input, form, nav)
- Mobile-first: Large touch targets (button min 10px padding, 1rem font)
- High contrast for outdoor visibility

### UI Patterns
- Forms wrapped in white cards (`background: white; padding: 16px; border-radius: 12px`)
- List items: White cards with flex layout, 8px margin between
- Delete buttons: Emoji (❌) with 8px left margin
- Empty states: Plain `<div>` with text (e.g., "Aucune catégorie")

## Project-Specific Rules

### French Labels
- Always use French for UI text: "Ajouter", "Supprimer", "Stock", "Prix"
- Currency: Always "CFA" (West African Franc)
- Example: "500 CFA", not "$500" or "500 FCFA"

### Phase 1 Constraints (Current)
- **No images yet** — Phase 2 feature (planned: Base64 or File API)
- **No item variants** — Single price per item only
- **No sales or customers** — Phase 3+
- Focus: Category + Item CRUD with basic persistence

### Delete Behavior
- Categories: Check for child items before delete (see `deleteCategory` in db.js)
- Items: Direct delete with confirmation (`confirm()` dialog)
- Wrong handler in Stock.jsx: `handleDeleteCategory` called for items (Line 74)

## Key Files Reference

| File | Purpose |
|------|---------|
| `PROJECT_PLAN.md` | 12-phase roadmap (8–12 weeks) — source of truth for features |
| `PROGRESS.md` | Milestone tracker — update after completing features |
| `src/db.js` | All IndexedDB logic — add new tables/functions here |
| `src/App.jsx` | Router + navigation — add new routes here |
| `src/pages/Stock.jsx` | Most complex page — reference for CRUD patterns |

## Commands

```bash
npm run dev        # Start Vite dev server (default: http://localhost:5173)
npm run build      # Production build to dist/
npm run preview    # Preview production build
```

## Common Tasks

### Adding a New Page
1. Create `src/pages/NewPage.jsx` with `export default function NewPage()`
2. Import in `App.jsx`: `import NewPage from './pages/NewPage.jsx'`
3. Add route: `<Route path="/new" element={<NewPage />} />`
4. Add nav link: `<NavLink to="/new">Label</NavLink>`

### Adding a Database Table
1. Update `db.version(1).stores({...})` with new table schema
2. Export async functions (add, list, delete, update)
3. Pattern: Validate in function, throw Error if invalid
4. Always return Promise (Dexie methods are Promises)

### Form with DB Save
- Use controlled inputs (value + onChange)
- Async submit handler with try-catch
- Call refresh function after successful save
- Clear form state after save

## Testing Checklist

Before marking Phase 1 complete:
- [ ] Can create 3 categories (e.g., Ampoule, Plaquette, Filtre)
- [ ] Can create 2 items in one category (e.g., H4, H7 in Ampoule)
- [ ] Can create 1 standalone item (categoryId = null)
- [ ] Data persists after page refresh (F5)
- [ ] Cannot delete category with items (shows error alert)
- [ ] Can delete empty category successfully
- [ ] Can delete items (fixes delete handler bug first)

## Known Issues

1. **db.js line 36**: Typo `itemsInCat > o` should be `itemsInCat > 0`
2. **db.js line 37**: Variable name `itemsIncat` should be `itemsInCat`
3. **Stock.jsx line 74**: Wrong handler — `handleDeleteCategory` used for items, should be `handleDeleteItem`
4. **main.jsx line 2**: Typo `react-DOM/client` should be `react-dom/client` (lowercase)

## Multi-Phase Context

- **Current**: Phase 1 (Foundation)
- **Next**: Phase 2 (Images + Variants)
- **Future**: Sales, Customers, Cloud sync (Phases 3–8)

When adding features, check `PROJECT_PLAN.md` phase definitions. Don't implement Phase 2+ features until Phase 1 tests pass.
