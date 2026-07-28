/**
 * ERPContext — single source of truth for all TechZone ERP data.
 *
 * When a sale is marked Completed (either on creation or via status edit):
 *  → inventory quantity is reduced automatically
 *  → a Sales Revenue transaction is appended to the Finance ledger
 *  → all dashboard stats recompute instantly via useMemo
 */
import React, {
  createContext, useContext, useState, useMemo, useCallback,
} from 'react';
import { salesOrders, productsList, financeData } from '@/data/dummyData';

/* ═══════════════════════ Types ═══════════════════════ */

export interface Order {
  id: string;
  customer: string;
  products: string;       // display string e.g. "iPhone 15 Pro (x2)"
  productId?: string;     // links to Product.id (only set for orders placed through the form)
  quantity?: number;
  total: number;
  date: string;
  payment: string;
  status: 'Completed' | 'Processing' | 'Pending' | 'Cancelled';
}

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  status: string;
  barcode: string;
  supplier: string;
  reorderLevel: number;
}

export interface Transaction {
  id: string;
  type: 'Income' | 'Expense';
  category: string;
  description: string;
  amount: number;
  date: string;
  reference: string;
}

export interface ERPContextType {
  /* ── state ── */
  orders:       Order[];
  products:     Product[];
  transactions: Transaction[];

  /* ── computed dashboard stats ── */
  totalRevenue:       number;   // base + live completed-order sum
  totalOrders:        number;   // base + live orders count
  totalProductsCount: number;   // products.length
  lowStockProducts:   Product[]; // stock < 5

  /* ── finance summary (computed from transactions) ── */
  totalIncome:   number;
  totalExpenses: number;
  netProfit:     number;

  /* ── actions ── */
  addOrder:      (order: Omit<Order, 'id'>) => void;
  updateOrder:   (id: string, updates: Partial<Order>) => void;
  deleteOrder:   (id: string) => void;
  addProduct:    (product: Omit<Product, 'id' | 'status'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addTransaction:(txn: Omit<Transaction, 'id'>) => void;
}

/* ═══════════════════════ Helpers ═══════════════════════ */

/**
 * Historical revenue beyond the 10 initial orders.
 * Keeps the displayed total at $2,847,320 at startup, then grows with new sales.
 *
 * Initial completed orders: ORD-101 $7,995 + ORD-103 $1,099 + ORD-105 $348
 *                         + ORD-107 $3,299 + ORD-108 $249  = $12,990
 */
const BASE_REVENUE = 2_847_320 - 12_990; // 2,834,330
const BASE_ORDERS  = 3_891    - salesOrders.length; // 3,881

function deriveStatus(stock: number, reorderLevel: number): string {
  if (stock === 0)              return 'Out of Stock';
  if (stock < reorderLevel)     return 'Low Stock';
  return 'In Stock';
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString().slice(-7)}`;
}

/* ═══════════════════════ Context ═══════════════════════ */

const ERPContext = createContext<ERPContextType | null>(null);

export function ERPProvider({ children }: { children: React.ReactNode }) {
  const [orders,       setOrders]       = useState<Order[]>(salesOrders as Order[]);
  const [products,     setProducts]     = useState<Product[]>(productsList as Product[]);
  const [transactions, setTransactions] = useState<Transaction[]>(
    financeData.transactions as Transaction[]
  );

  /* ── computed dashboard stats ── */
  const totalRevenue = useMemo(
    () => BASE_REVENUE + orders
      .filter(o => o.status === 'Completed')
      .reduce((sum, o) => sum + o.total, 0),
    [orders]
  );

  const totalOrders = useMemo(() => BASE_ORDERS + orders.length, [orders]);

  const totalProductsCount = useMemo(() => products.length, [products]);

  /** Low stock: any product with fewer than 5 units */
  const lowStockProducts = useMemo(
    () => products.filter(p => p.stock < 5).sort((a, b) => a.stock - b.stock),
    [products]
  );

  /* ── finance summary (live from transactions) ── */
  const totalIncome = useMemo(
    () => transactions.filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  const totalExpenses = useMemo(
    () => transactions.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  const netProfit = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);

  /* ══════════════════ Internal sync helper ══════════════════
   * Called whenever an order transitions INTO "Completed":
   *  1. Reduce the linked product's stock
   *  2. Append a Sales Revenue transaction to the ledger
   */
  const syncCompletedSale = useCallback((order: Order) => {
    // 1. Inventory reduction
    if (order.productId && order.quantity) {
      setProducts(prev => prev.map(p => {
        if (p.id !== order.productId) return p;
        const newStock = Math.max(0, p.stock - order.quantity!);
        return { ...p, stock: newStock, status: deriveStatus(newStock, p.reorderLevel) };
      }));
    }

    // 2. Finance transaction
    setTransactions(prev => [{
      id:          makeId('TRX'),
      type:        'Income' as const,
      category:    'Sales Revenue',
      description: `Sale – ${order.customer} · ${order.products}`,
      amount:      order.total,
      date:        order.date,
      reference:   order.id,
    }, ...prev]);
  }, []);

  /* ══════════════════ Actions ══════════════════ */

  /** Add a new order. If status is Completed, auto-syncs inventory + finance. */
  const addOrder = useCallback((orderData: Omit<Order, 'id'>) => {
    const newOrder: Order = { ...orderData, id: makeId('ORD') };
    setOrders(prev => [newOrder, ...prev]);
    if (newOrder.status === 'Completed') {
      syncCompletedSale(newOrder);
    }
  }, [syncCompletedSale]);

  /**
   * Update an existing order.
   * If status transitions to Completed for the first time, syncs inventory + finance.
   */
  const updateOrder = useCallback((id: string, updates: Partial<Order>) => {
    // Read current state before any mutation (safe in synchronous event handlers)
    setOrders(prev => {
      const existing = prev.find(o => o.id === id);
      const nowCompleted  = updates.status === 'Completed';
      const wasCompleted  = existing?.status === 'Completed';

      if (existing && nowCompleted && !wasCompleted) {
        // Schedule the side-effects to run right after this setState batch
        const mergedOrder = { ...existing, ...updates };
        Promise.resolve().then(() => syncCompletedSale(mergedOrder));
      }

      return prev.map(o => o.id === id ? { ...o, ...updates } : o);
    });
  }, [syncCompletedSale]);

  const deleteOrder = useCallback((id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  }, []);

  const addProduct = useCallback((productData: Omit<Product, 'id' | 'status'>) => {
    const status = deriveStatus(productData.stock, productData.reorderLevel);
    setProducts(prev => [...prev, { ...productData, id: makeId('PRD'), status }]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const merged = { ...p, ...updates };
      return { ...merged, status: deriveStatus(merged.stock, merged.reorderLevel) };
    }));
  }, []);

  const addTransaction = useCallback((txnData: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [{ ...txnData, id: makeId('TRX') }, ...prev]);
  }, []);

  /* ══════════════════ Provider value ══════════════════ */

  const value: ERPContextType = {
    orders, products, transactions,
    totalRevenue, totalOrders, totalProductsCount, lowStockProducts,
    totalIncome, totalExpenses, netProfit,
    addOrder, updateOrder, deleteOrder,
    addProduct, updateProduct, addTransaction,
  };

  return <ERPContext.Provider value={value}>{children}</ERPContext.Provider>;
}

export function useERP(): ERPContextType {
  const ctx = useContext(ERPContext);
  if (!ctx) throw new Error('useERP must be used inside <ERPProvider>');
  return ctx;
}
