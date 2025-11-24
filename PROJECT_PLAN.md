# 📋 Marché Pièces Pro — Complete Project Plan

**Project Goal:** Build an offline-first, image+text inventory & sales management system for spare parts sellers in Abidjan, optimized for low-literacy users (sellers and buyers).

---

## 🎯 Core Principles

1. **Simplicity First:** Large buttons, visual icons, minimal typing
2. **Offline Capable:** All daily operations work without internet
3. **Local Context:** French labels, market terms, Mobile Money support
4. **Image-Based:** Photos for identification, not just text lists
5. **Flexible Structure:** Support grouped items (e.g., Ampoule → H1, H3, H4) AND standalone items
6. **Multi-Price:** Same item type can have different prices (e.g., H4 from different suppliers)
7. **Two Sides:** Seller interface (full control) + Buyer interface (view catalog, simple)

---

## 📊 Data Model (What We'll Store)

### 1. Categories (Sections)
- `id`, `name` (e.g., "Ampoule", "Plaquette", "Filtre")
- `icon` or `photo` (optional)
- Can contain multiple items OR be standalone

### 2. Items (Products)
- `id`, `name` (e.g., "H4", "Bougie NGK")
- `categoryId` (nullable — for grouped items)
- `photos[]` (array of image URLs/paths — primary photo first)
- `description` (optional text)
- `stockQty` (current quantity available)
- `isStandalone` (true if not part of a category)

### 3. Item Variants (Prices & Suppliers)
- `id`, `itemId`
- `supplierName` (e.g., "Fournisseur A", "Marché Adjamé")
- `purchasePrice` (what seller paid)
- `sellPrice` (what seller charges)
- `stockQty` (separate stock per variant)
- `notes` (optional: quality, brand, etc.)

**Why Variants?** Same H4 bulb from 2 suppliers = 2 prices/stocks.

### 4. Customers (Clients)
- `id`, `name`, `phone` (unique key)
- `debtBalance` (total owed)
- `notes` (optional: vehicle type, loyalty status)

### 5. Sales (Transactions)
- `id`, `date`, `totalAmount`
- `paymentMethod` (cash, mobileMoneyMTN, mobileMoneyOrange, moov, credit)
- `customerId` (nullable — only for credit sales)
- `attendantName` (who made the sale — for multi-user shops)
- `status` (completed, pending — for credit tracking)

### 6. Sale Lines (Items in a Sale)
- `id`, `saleId`, `itemVariantId`
- `qty`, `unitPrice` (snapshot at sale time)
- `subtotal`

### 7. Payments (Credit Repayments)
- `id`, `customerId`, `amount`, `date`
- `method` (cash, mobileMoney)
- `saleId` (optional link to original credit sale)

### 8. Stock Movements (Audit Trail)
- `id`, `itemVariantId`, `type` (purchase, sale, adjustment, loss)
- `qty` (+ for additions, - for reductions)
- `cost` (for purchases)
- `date`, `notes`

---

## 🏗️ Project Structure (Phases)

### **Phase 1: Foundation (Weeks 1–2)**
✅ **Milestone:** Basic project setup + Category & Item CRUD (text-only first)

**What to Build:**
1. Set up React + Vite + React Router
2. Create simple navigation (Dashboard, Stock, Sales, Clients)
3. Set up IndexedDB (Dexie) with Categories and Items tables
4. Build **Category Management:**
   - Add category (name only)
   - List all categories
   - Delete category (if no items inside)
5. Build **Item Management (Basic):**
   - Select category OR mark as standalone
   - Add item name, single price, stock qty
   - List items (text-only for now)
   - Edit/Delete item

**Testing Checklist:**
- [ ] Can create 3 categories (Ampoule, Plaquette, Filtre)
- [ ] Can create 2 items in "Ampoule" (H4, H7)
- [ ] Can create 1 standalone item (Bougie NGK)
- [ ] Data persists after page refresh
- [ ] Can delete empty category
- [ ] Cannot delete category with items (show warning)

---

### **Phase 2: Images & Variants (Weeks 3–4)**
✅ **Milestone:** Photo capture/upload + Multiple prices per item

**What to Build:**
1. **Image Handling:**
   - Camera capture (mobile) OR file upload (desktop)
   - Store images as Base64 in IndexedDB OR local files
   - Display primary photo in item list
   - Gallery view for multiple photos per item
2. **Item Variants:**
   - Add "Variants" table to database
   - When adding item, allow multiple price entries:
     - Supplier name (optional: "Default" if blank)
     - Purchase price (cost)
     - Sell price
     - Stock qty
   - List variants under each item (expandable)
   - Edit/Delete individual variants

**Testing Checklist:**
- [ ] Can take photo of H4 bulb and save to item
- [ ] Can add 2 variants of H4 (supplier A: 500 CFA, supplier B: 600 CFA)
- [ ] Stock qty is tracked separately per variant
- [ ] Photo displays in item list (thumbnail)
- [ ] Can tap item to see all photos + all variants

---

### **Phase 3: Sales Flow (Weeks 5–6)**
✅ **Milestone:** Complete cash + credit sales with stock reduction

**What to Build:**
1. **Sales Screen (Seller Side):**
   - Display items as photo grid (category filters)
   - Tap item → show variants → select variant
   - Quantity stepper (+/-)
   - Shopping cart view (items, qty, subtotal)
   - **Total displayed LARGE** for buyer to see
2. **Payment Methods:**
   - Cash (immediate completion)
   - Mobile Money (MTN, Orange, Moov — just record reference)
   - Credit (attach/create customer)
3. **Credit Sales:**
   - Toggle "Vente à Crédit"
   - Search customer by phone or create new
   - Save sale with `status: pending`
   - Update customer `debtBalance`
4. **Stock Update:**
   - Automatically reduce `stockQty` of selected variant
   - Record StockMovement (type: sale)

**Testing Checklist:**
- [ ] Can browse items by photo
- [ ] Can select H4 variant A, qty 2, add to cart
- [ ] Total calculates correctly (2 × 500 = 1000 CFA)
- [ ] Can complete cash sale → stock reduces by 2
- [ ] Can complete credit sale → customer debt increases
- [ ] Sale appears in sales history with correct details

---

### **Phase 4: Customer & Debt Management (Week 7)**
✅ **Milestone:** Client database + Payment recording

**What to Build:**
1. **Clients Screen:**
   - Add customer (name, phone, optional vehicle/notes)
   - List customers with outstanding debt highlighted (red if >0)
   - Tap customer → view profile:
     - Purchase history (all sales)
     - Outstanding balance (big, bold)
     - "Enregistrer Paiement" button
2. **Payment Recording:**
   - Enter amount received
   - Select method (cash/mobile money)
   - Reduce `debtBalance`
   - Create Payment record
3. **Debt Alerts:**
   - Dashboard shows total debt owed to shop
   - Low stock + high debt customers visible at a glance

**Testing Checklist:**
- [ ] Can add customer "Jean" with phone 07 12 34 56 78
- [ ] After credit sale, Jean's debt shows 1000 CFA
- [ ] Can record payment of 500 CFA → debt now 500 CFA
- [ ] Payment history visible on Jean's profile
- [ ] Dashboard shows total debts: 500 CFA

---

### **Phase 5: Dashboard & Reports (Week 8)**
✅ **Milestone:** Daily summary + Basic analytics

**What to Build:**
1. **Dashboard Tiles:**
   - Total sales today (cash + credit)
   - Total cash received today
   - Total credit given today
   - Low stock items (qty ≤ 5) — count + quick link
   - Total outstanding debts
2. **Simple Reports:**
   - Sales history (filter by date, payment method)
   - Best-selling items (top 5 this week/month)
   - Slow-moving stock (items with 0 sales in 30 days)
3. **Export Data:**
   - Export sales to CSV
   - Export customer debts to CSV
   - Share via WhatsApp (text summary)

**Testing Checklist:**
- [ ] Dashboard shows today's sales total
- [ ] Can see 3 low-stock items on dashboard
- [ ] Sales history shows last 10 transactions
- [ ] Can export this week's sales to CSV
- [ ] Can share debt summary via WhatsApp

---

### **Phase 6: Buyer Interface (Week 9)**
✅ **Milestone:** Simple catalog view for customers

**What to Build:**
1. **Public Catalog (Read-Only):**
   - Browse categories
   - View items with photos and prices
   - Search by name or category
   - No editing, no stock qty visible (just "Available" or "Rupture")
2. **Access Control:**
   - Seller mode requires PIN (4-digit code)
   - Buyer mode is default (no PIN)
   - Toggle between modes with button

**Testing Checklist:**
- [ ] Buyer can browse catalog without PIN
- [ ] Buyer sees item photos and prices
- [ ] Buyer cannot see stock quantities or costs
- [ ] Seller can enter PIN to unlock full features
- [ ] Invalid PIN shows error, does not grant access

---

### **Phase 7: Multi-User & Cloud Backup (Week 10)**
✅ **Milestone:** Multiple attendants + Cloud sync

**What to Build:**
1. **User Roles:**
   - Owner (full access)
   - Attendant (can sell, cannot edit prices or delete)
   - Add simple user table (name, PIN, role)
   - Each sale records `attendantName`
2. **Cloud Backup (Supabase or Firebase):**
   - Daily auto-backup of all data
   - Manual "Backup Now" button
   - Restore from backup (select date)
3. **Multi-Device Sync:**
   - Owner can use phone + tablet
   - Background sync when online
   - Conflict resolution: last-write-wins for sales, additive for stock

**Testing Checklist:**
- [ ] Can create attendant "Marie" with PIN 1234
- [ ] Marie can make sales but cannot delete items
- [ ] Daily backup runs automatically
- [ ] Can restore data from yesterday's backup
- [ ] Sales made on phone appear on tablet after sync

---

### **Phase 8: Advanced Features (Weeks 11–12)**
✅ **Milestone:** Printing, notifications, analytics

**What to Build:**
1. **Receipt Printing:**
   - Bluetooth thermal printer support (Android Chrome)
   - Print receipt after sale (shop name, items, total, date)
   - WhatsApp receipt (text-based for customers)
2. **Notifications:**
   - Low stock alert (when item qty ≤ 5)
   - Debt reminder (SMS/WhatsApp for customers)
3. **Advanced Analytics:**
   - Profit calculation (sell price - purchase price)
   - Monthly revenue chart
   - Supplier comparison (which supplier is cheaper/better)

**Testing Checklist:**
- [ ] Can print receipt via Bluetooth printer
- [ ] Low stock alert appears when H4 qty = 3
- [ ] Can send WhatsApp reminder to customer with 500 CFA debt
- [ ] Profit calculation shows 200 CFA margin on last sale
- [ ] Monthly chart shows sales trend (Nov 2025)

---

## 🎨 UI Design Principles (Your Loved Style)

### Layout
- **Large touch targets:** Minimum 60px height for buttons
- **Bold typography:** Titles 1.2–1.6rem, buttons 1rem+
- **Color-coded status:**
  - Green (good stock, paid)
  - Yellow (low stock, partial payment)
  - Red (out of stock, overdue debt)
- **Grid layout:** 2-column grid for items/categories on mobile

### Components to Build
1. **Big Button** (primary action, full width)
2. **Qty Stepper** (+/- buttons with number display)
3. **Photo Tile** (image + name + status badge)
4. **Category Card** (icon + name, tap to filter)
5. **Cart Item Row** (photo thumbnail, name, qty, price, remove)
6. **Customer Card** (name, phone, debt badge)
7. **Simple Modal** (confirm delete, enter PIN, record payment)
8. **Nav Bar** (bottom or top, 4–5 main sections)

### CSS Strategy
- Start with inline styles or `styles.css`
- Use CSS Grid + Flexbox (no complex frameworks)
- Mobile-first (320px–480px base, scale up)
- High contrast for outdoor visibility

---

## 🛠️ Tech Stack (Simplified)

### Frontend
- **React** (you already know it!)
- **React Router** (for pages)
- **Vite** (fast dev server, simple build)

### Data
- **IndexedDB** (via Dexie.js — localStorage too small)
- **Base64 images** (or File API for photos)

### Offline
- **Service Worker** (cache app shell + API responses)
- **Background Sync API** (for cloud backup when online)

### Cloud (Phase 7+)
- **Supabase** (Postgres + storage + auth — easiest)
- OR **Firebase** (Firestore + storage)

### Deployment
- **PWA:** Installable on Android home screen
- **Desktop:** Same PWA works on Windows/Mac
- **Optional:** Electron wrapper for offline Windows app

---

## 📝 Development Workflow (Your Approach)

### Step-by-Step Process
1. **Plan:** Agree on feature scope for this session
2. **Build:** You write code (HTML/CSS/JS), I guide/review
3. **Test:** Try it in browser, check all edge cases
4. **Debug:** Fix issues together, explain why
5. **Commit:** Save progress (Git optional but recommended)
6. **Repeat:** Move to next small feature

### Testing Before Advancing
- [ ] Feature works with sample data (3–5 items)
- [ ] Works offline (disconnect Wi-Fi, refresh page)
- [ ] Data persists (close browser, reopen)
- [ ] Error handling (empty fields, invalid input)
- [ ] Mobile-friendly (test on phone or Chrome DevTools mobile view)

### When Stuck
- Ask me "How do I [specific task]?" — I'll explain concept + show mini example
- Share error message — we'll debug together
- Request code review — I'll suggest improvements

---

## 📐 Feature Breakdown (Detailed)

### Feature: Add Item with Variants
**User Flow:**
1. Seller taps "Ajouter Article"
2. Selects category (or "Standalone")
3. Enters item name (e.g., "H4")
4. Takes/uploads photo(s)
5. Adds first variant:
   - Supplier name (optional)
   - Purchase price: 400 CFA
   - Sell price: 500 CFA
   - Stock qty: 10
6. Taps "+ Autre Variante" (optional)
7. Adds second variant (different supplier, price)
8. Taps "Enregistrer"

**What Happens:**
- Item saved to `items` table with `categoryId` and `photos[]`
- Each variant saved to `itemVariants` table linked to `itemId`
- Redirect to item list, new item appears with photo

**Edge Cases:**
- No photo: Use placeholder icon
- No variants: Create one default variant with entered price
- Duplicate name: Allow (user may have same name for different types)

---

### Feature: Make Credit Sale
**User Flow:**
1. Seller taps "Vente"
2. Browses items, selects H4 (variant A)
3. Adjusts qty to 2
4. Taps "Ajouter au Panier"
5. Cart shows: H4 × 2 = 1000 CFA
6. Taps "Vente à Crédit" toggle (turns yellow/orange)
7. Prompted: "Sélectionner Client"
8. Searches phone "07 12 34 56 78" → finds "Jean"
9. Taps "Jean", then "Terminer Vente"

**What Happens:**
- Sale saved with `paymentMethod: 'credit'`, `customerId: Jean.id`, `status: 'pending'`
- Sale lines saved (itemVariantId, qty, unitPrice)
- Stock reduced: H4 variant A qty -= 2
- Jean's `debtBalance` += 1000
- Confirmation: "Vente enregistrée ✔ Dette de Jean: 1000 CFA"

**Edge Cases:**
- Customer not found: Show "Créer Nouveau Client" button
- Zero stock: Disable item selection, show "Rupture" badge
- Negative qty: Stepper min = 0

---

### Feature: Record Payment
**User Flow:**
1. Seller taps "Clients"
2. Sees Jean with "Dette: 1000 CFA" in red badge
3. Taps Jean → profile opens
4. Taps "Enregistrer Paiement"
5. Modal: "Montant Reçu?" → enters 500
6. Selects method: "Cash"
7. Taps "Enregistrer"

**What Happens:**
- Payment saved: `{ customerId: Jean.id, amount: 500, method: 'cash', date: now }`
- Jean's `debtBalance` -= 500 (now 500 CFA)
- Badge updates to "Dette: 500 CFA" (still red)
- If debt = 0, badge turns green: "Payé ✔"

**Edge Cases:**
- Amount > debt: Show warning "Trop-perçu: +200 CFA" (optional: record as credit for next purchase)
- Amount = 0: Disable "Enregistrer" button

---

## 🚀 Deployment Plan (Phase 9+)

### Option 1: PWA (Recommended)
- Build for production: `npm run build`
- Deploy to free hosting (Vercel, Netlify, GitHub Pages)
- Share link: users open in browser, tap "Add to Home Screen"
- Updates automatic (service worker refresh)

### Option 2: Android APK (Capacitor)
- Wrap PWA with Capacitor
- Build APK for sideloading (no Play Store needed)
- Sign APK for distribution

### Option 3: Desktop App (Electron)
- Wrap PWA with Electron
- Build `.exe` for Windows, `.dmg` for Mac
- Distribute via USB/WhatsApp

---

## 📊 Success Metrics (How to Know It's Working)

### User Adoption
- [ ] 5+ pilot shops using daily (Phase 3+)
- [ ] 50+ sales recorded per shop per week
- [ ] 80%+ of sellers can complete sale without help

### Technical Performance
- [ ] App loads in <2s on 3G
- [ ] Offline mode works 100% for sales/stock
- [ ] Zero data loss (backup every 24h)

### Business Value
- [ ] Sellers report 20%+ reduction in stockouts
- [ ] 30%+ faster checkout vs paper notebook
- [ ] 50%+ better debt tracking/repayment

---

## 🔧 Quick Reference: File Structure

```
spare-parts-pwa/
├── public/
│   ├── manifest.webmanifest
│   ├── sw.js
│   └── icons/ (192, 512)
├── src/
│   ├── main.jsx (entry point)
│   ├── App.jsx (router)
│   ├── db.js (Dexie setup)
│   ├── styles.css (global styles)
│   ├── components/
│   │   ├── BigButton.jsx
│   │   ├── QtyStepper.jsx
│   │   ├── PhotoTile.jsx
│   │   ├── CategoryCard.jsx
│   │   ├── CartItem.jsx
│   │   ├── CustomerCard.jsx
│   │   └── Modal.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Stock.jsx (categories + items)
│   │   ├── ItemDetail.jsx (variants + photos)
│   │   ├── Sales.jsx (cash register)
│   │   ├── Clients.jsx (customer list)
│   │   ├── ClientDetail.jsx (profile + payments)
│   │   ├── Reports.jsx (analytics)
│   │   └── Settings.jsx (backup, PIN)
│   └── utils/
│       ├── camera.js (photo capture)
│       ├── export.js (CSV generation)
│       └── sync.js (cloud backup logic)
├── package.json
├── vite.config.js
├── README.md
└── PROJECT_PLAN.md (this file)
```

---

## 📋 Checklist Tracker (Copy to Your Word Doc)

### Phase 1: Foundation ⬜
- [ ] Project setup (Vite + React + Router)
- [ ] Database (Dexie with Categories + Items)
- [ ] Category CRUD (add, list, delete)
- [ ] Item CRUD (name, price, stock)
- [ ] Navigation (Dashboard, Stock, Sales, Clients)

### Phase 2: Images & Variants ⬜
- [ ] Photo capture/upload
- [ ] Photo storage (Base64 or File API)
- [ ] Item variants table
- [ ] Add/edit/delete variants
- [ ] Display photos in item list

### Phase 3: Sales Flow ⬜
- [ ] Photo grid item browser
- [ ] Variant selection
- [ ] Shopping cart
- [ ] Cash payment
- [ ] Credit payment (attach customer)
- [ ] Stock reduction on sale

### Phase 4: Customer & Debt ⬜
- [ ] Customer CRUD (name, phone, debt)
- [ ] Payment recording
- [ ] Debt calculation
- [ ] Purchase history per customer

### Phase 5: Dashboard & Reports ⬜
- [ ] Daily sales summary
- [ ] Low stock alerts
- [ ] Sales history
- [ ] CSV export

### Phase 6: Buyer Interface ⬜
- [ ] Read-only catalog
- [ ] PIN protection for seller mode
- [ ] Search/filter for buyers

### Phase 7: Multi-User & Cloud ⬜
- [ ] User roles (owner, attendant)
- [ ] Cloud backup setup
- [ ] Auto-backup daily
- [ ] Multi-device sync

### Phase 8: Advanced Features ⬜
- [ ] Receipt printing
- [ ] Low stock notifications
- [ ] Profit analytics

---

## 💡 Tips for Success

1. **Start tiny:** Build one button, test it, celebrate, move on
2. **Test with real data:** Use your father's actual items (5–10 to start)
3. **Mobile-first:** Test on phone early and often
4. **Ask questions:** No question is too small
5. **Break when stuck:** Take a break, come back fresh
6. **Celebrate progress:** Each working feature is a win 🎉

---

## 🤝 How We'll Work Together

**You code, I guide:**
- You write HTML/CSS/JS
- I review, suggest improvements
- We debug together
- I explain concepts when needed

**My role:**
- Answer "how do I...?" questions
- Provide code snippets/examples (you adapt them)
- Review your code, point out issues
- Suggest best practices
- Keep you on track with the plan

**Your role:**
- Write the actual code
- Test each feature thoroughly
- Decide on UX details (colors, labels, flow)
- Ask when unclear
- Track progress (this plan + your own notes)

---

## 🎯 Next Steps (When You're Ready)

1. **Save this plan** to Word/Google Docs for tracking
2. **Tell me:** "I'm ready to delete and restart"
3. **We'll set up:** Empty project (package.json only)
4. **Phase 1, Step 1:** Create `index.html` + basic React setup
5. **Build together:** One feature at a time, test each thoroughly

---

**Remember:** You're not just building an app, you're building your skills. Every line you write yourself makes you a better developer. I'm here to guide, not to do it for you. Let's make something awesome for your dad! 🚀

---

*Last Updated: November 13, 2025*
