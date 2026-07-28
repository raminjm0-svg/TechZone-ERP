import { useState, useMemo } from 'react';
import { Search, Plus, ShoppingCart, MoreHorizontal, Pencil, Trash2, FileText, CheckCircle, Clock, TrendingUp, XCircle, Zap } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useERP, type Order } from '@/context/ERPContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

/* ── schema ── */
const newSaleSchema = z.object({
  customerName:  z.string().min(2,  'Customer name is required'),
  customerEmail: z.string().email('Invalid email').or(z.literal('')).optional(),
  productId:     z.string().min(1,  'Please select a product'),
  quantity:      z.coerce.number().min(1, 'Must be at least 1'),
  paymentMethod: z.string().min(1,  'Payment method is required'),
  status:        z.enum(['Completed', 'Processing', 'Pending', 'Cancelled']),
  discount:      z.coerce.number().min(0).max(100).default(0),
  notes:         z.string().optional(),
});
type NewSaleForm = z.infer<typeof newSaleSchema>;

/* ── badge helpers ── */
const statusBadge: Record<string, string> = {
  Completed:  'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
  Processing: 'bg-blue-50   text-blue-700   border-blue-200   hover:bg-blue-100',
  Pending:    'bg-amber-50  text-amber-700  border-amber-200  hover:bg-amber-100',
  Cancelled:  'bg-rose-50   text-rose-700   border-rose-200   hover:bg-rose-100',
};
const statusIcon: Record<string, React.ReactNode> = {
  Completed:  <CheckCircle className="w-3.5 h-3.5" />,
  Processing: <TrendingUp  className="w-3.5 h-3.5" />,
  Pending:    <Clock       className="w-3.5 h-3.5" />,
  Cancelled:  <XCircle     className="w-3.5 h-3.5" />,
};

const paymentLabels: Record<string, string> = {
  credit: 'Credit Card', debit: 'Debit Card',
  bank: 'Bank Transfer', cash: 'Cash',
};

export default function SalesPage() {
  const { orders, products, addOrder, updateOrder, deleteOrder } = useERP();
  const { toast } = useToast();

  const [searchTerm,    setSearchTerm]    = useState('');
  const [activeTab,     setActiveTab]     = useState('orders');
  const [statusFilter,  setStatusFilter]  = useState('All');
  const [editingOrder,  setEditingOrder]  = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);

  /* ── filtered view ── */
  const filteredOrders = useMemo(() =>
    orders
      .filter(o => statusFilter === 'All' || o.status === statusFilter)
      .filter(o =>
        !searchTerm ||
        o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.products.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [orders, statusFilter, searchTerm]
  );

  /* ── summary counts ── */
  const counts = useMemo(() => ({
    all:        orders.length,
    completed:  orders.filter(o => o.status === 'Completed').length,
    processing: orders.filter(o => o.status === 'Processing').length,
    pending:    orders.filter(o => o.status === 'Pending').length,
    cancelled:  orders.filter(o => o.status === 'Cancelled').length,
  }), [orders]);

  /* ── new sale form ── */
  const form = useForm<NewSaleForm>({
    resolver: zodResolver(newSaleSchema),
    defaultValues: {
      customerName: '', customerEmail: '',
      productId: '', quantity: 1,
      paymentMethod: '', status: 'Processing',
      discount: 0, notes: '',
    },
  });

  const watchedProductId = form.watch('productId');
  const watchedQty       = form.watch('quantity');
  const watchedDiscount  = form.watch('discount');

  const selectedProduct = useMemo(
    () => products.find(p => p.id === watchedProductId),
    [products, watchedProductId]
  );
  const liveTotal = useMemo(() => {
    if (!selectedProduct) return 0;
    const raw = selectedProduct.price * (watchedQty || 0);
    return raw * (1 - (watchedDiscount || 0) / 100);
  }, [selectedProduct, watchedQty, watchedDiscount]);

  const onSubmit = (data: NewSaleForm) => {
    const product = products.find(p => p.id === data.productId);
    if (!product) return;

    const isCompleted = data.status === 'Completed';

    // Check sufficient stock when completing immediately
    if (isCompleted && product.stock < data.quantity) {
      toast({
        title: 'Insufficient Stock',
        description: `Only ${product.stock} units of ${product.name} available.`,
        variant: 'destructive',
      });
      return;
    }

    const payment = paymentLabels[data.paymentMethod] ?? data.paymentMethod;
    const today   = new Date().toISOString().split('T')[0];

    addOrder({
      customer:  data.customerName,
      products:  `${product.name} (x${data.quantity})`,
      productId: product.id,
      quantity:  data.quantity,
      total:     liveTotal,
      date:      today,
      payment,
      status:    data.status,
    });

    toast({
      title: isCompleted ? '✅ Sale Completed' : '📋 Order Created',
      description: isCompleted
        ? `Sale recorded. Inventory & Finance updated automatically.`
        : `Order created for ${data.customerName}.`,
    });

    form.reset();
    setActiveTab('orders');
  };

  /* ── edit / delete ── */
  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    updateOrder(editingOrder.id, editingOrder);
    toast({ title: 'Order Updated', description: `Order ${editingOrder.id} saved.` });
    setEditingOrder(null);
  };

  const handleDelete = () => {
    if (!deletingOrder) return;
    deleteOrder(deletingOrder.id);
    toast({ title: 'Order Deleted', description: `Order ${deletingOrder.id} removed.` });
    setDeletingOrder(null);
  };

  const handleViewInvoice = (order: Order) => {
    toast({
      title: `Invoice – ${order.id}`,
      description: `${order.customer} · ${order.products} · $${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-xl">
          <ShoppingCart className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Sales</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Manage orders and create new sales transactions.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-secondary rounded-xl">
          <TabsTrigger value="orders" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Order History
          </TabsTrigger>
          <TabsTrigger value="new" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
            New Sale
          </TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>

            {/* ── Order History ── */}
            <TabsContent value="orders" className="mt-0">
              <Card className="shadow-sm border-border rounded-2xl overflow-hidden">
                <CardHeader className="pb-6 border-b border-border bg-card">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">Order History</CardTitle>
                      <CardDescription className="font-medium mt-1">
                        All transactions · {orders.length} total orders
                      </CardDescription>
                    </div>
                    <div className="relative w-full sm:w-72">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search orders..."
                        className="pl-10 h-10 rounded-xl bg-secondary/50 border-transparent focus:bg-white focus:border-primary transition-colors"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Filter pills with counts */}
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                    {[
                      { label: 'All',        count: counts.all },
                      { label: 'Completed',  count: counts.completed },
                      { label: 'Processing', count: counts.processing },
                      { label: 'Pending',    count: counts.pending },
                      { label: 'Cancelled',  count: counts.cancelled },
                    ].map(({ label, count }) => (
                      <button
                        key={label}
                        onClick={() => setStatusFilter(label)}
                        className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
                          statusFilter === label
                            ? 'bg-primary text-white'
                            : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {label}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                          statusFilter === label ? 'bg-white/20' : 'bg-border'
                        }`}>{count}</span>
                      </button>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-secondary/30">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold text-muted-foreground px-6 py-4">Order ID</TableHead>
                        <TableHead className="font-semibold text-muted-foreground py-4">Customer</TableHead>
                        <TableHead className="font-semibold text-muted-foreground py-4">Products</TableHead>
                        <TableHead className="font-semibold text-muted-foreground py-4">Date</TableHead>
                        <TableHead className="font-semibold text-muted-foreground py-4">Payment</TableHead>
                        <TableHead className="font-semibold text-muted-foreground text-right py-4">Total</TableHead>
                        <TableHead className="font-semibold text-muted-foreground text-right py-4">Status</TableHead>
                        <TableHead className="font-semibold text-muted-foreground text-right px-6 py-4">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map(order => (
                          <TableRow key={order.id} className="group hover:bg-secondary/20 transition-colors">
                            <TableCell className="font-mono text-xs font-bold text-primary px-6 py-4">{order.id}</TableCell>
                            <TableCell className="font-bold text-foreground py-4">{order.customer}</TableCell>
                            <TableCell className="max-w-[200px] truncate font-medium text-muted-foreground py-4" title={order.products}>
                              {order.products}
                            </TableCell>
                            <TableCell className="text-muted-foreground font-medium py-4">{order.date}</TableCell>
                            <TableCell className="font-medium text-muted-foreground py-4">{order.payment}</TableCell>
                            <TableCell className="text-right font-bold text-foreground py-4">
                              ${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-right py-4">
                              <Badge className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold border ${statusBadge[order.status] ?? ''}`}>
                                {statusIcon[order.status]}
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right px-6 py-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[160px]">
                                  <DropdownMenuItem onClick={() => handleViewInvoice(order)}>
                                    <FileText className="mr-2 h-4 w-4" /> View Invoice
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setEditingOrder({ ...order })}>
                                    <Pencil className="mr-2 h-4 w-4" /> Edit Order
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => setDeletingOrder(order)}
                                    className="text-rose-600 focus:text-rose-600 focus:bg-rose-50"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="h-32 text-center text-muted-foreground font-medium">
                            No orders found matching your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── New Sale Form ── */}
            <TabsContent value="new" className="mt-0">
              <Card className="shadow-sm border-border rounded-2xl max-w-3xl mx-auto overflow-hidden">
                <CardHeader className="pb-6 border-b border-border bg-card">
                  <CardTitle className="text-xl">Create Sales Order</CardTitle>
                  <CardDescription className="font-medium mt-1">
                    Completed orders auto-update Inventory and Finance
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                        {/* Customer Name */}
                        <FormField control={form.control} name="customerName" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-foreground">Customer Name</FormLabel>
                            <FormControl><Input placeholder="John Doe" className="h-11 rounded-xl" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        {/* Customer Email */}
                        <FormField control={form.control} name="customerEmail" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-foreground">Customer Email <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                            <FormControl><Input type="email" placeholder="john@example.com" className="h-11 rounded-xl" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        {/* Product Select — live from inventory context */}
                        <FormField control={form.control} name="productId" render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="font-semibold text-foreground">Product</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 rounded-xl">
                                  <SelectValue placeholder="Select a product from inventory" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {products.map(p => (
                                  <SelectItem key={p.id} value={p.id} disabled={p.stock === 0}>
                                    <span className="flex items-center gap-2">
                                      <span className="font-medium">{p.name}</span>
                                      <span className="text-muted-foreground text-xs">— ${p.price.toLocaleString()}</span>
                                      <span className={`text-xs font-bold ml-1 ${p.stock === 0 ? 'text-rose-500' : p.stock < 5 ? 'text-amber-500' : 'text-emerald-600'}`}>
                                        ({p.stock === 0 ? 'Out of Stock' : `${p.stock} in stock`})
                                      </span>
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />

                        {/* Quantity */}
                        <FormField control={form.control} name="quantity" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-foreground">
                              Quantity
                              {selectedProduct && (
                                <span className="text-xs font-normal text-muted-foreground ml-2">
                                  (max: {selectedProduct.stock})
                                </span>
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number" min="1"
                                max={selectedProduct?.stock}
                                className="h-11 rounded-xl" {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        {/* Discount */}
                        <FormField control={form.control} name="discount" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-foreground">Discount (%)</FormLabel>
                            <FormControl><Input type="number" min="0" max="100" className="h-11 rounded-xl" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        {/* Payment Method */}
                        <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-foreground">Payment Method</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select method" /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="credit">Credit Card</SelectItem>
                                <SelectItem value="debit">Debit Card</SelectItem>
                                <SelectItem value="bank">Bank Transfer</SelectItem>
                                <SelectItem value="cash">Cash</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />

                        {/* Status */}
                        <FormField control={form.control} name="status" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-foreground">Order Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Completed">✅ Completed</SelectItem>
                                <SelectItem value="Processing">⏳ Processing</SelectItem>
                                <SelectItem value="Pending">🕐 Pending</SelectItem>
                                <SelectItem value="Cancelled">❌ Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />

                        {/* Notes */}
                        <FormField control={form.control} name="notes" render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="font-semibold text-foreground">Order Notes <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                            <FormControl>
                              <Textarea placeholder="Any additional information..." className="resize-none min-h-[80px] rounded-xl" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      {/* Live total + sync notice */}
                      {selectedProduct && liveTotal > 0 && (
                        <div className="rounded-xl bg-secondary/50 border border-border p-4 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Order Total</p>
                            <p className="text-2xl font-bold text-foreground">
                              ${liveTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                            {watchedDiscount > 0 && (
                              <p className="text-xs text-muted-foreground">
                                {watchedDiscount}% discount applied (base: ${(selectedProduct.price * watchedQty).toLocaleString()})
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-semibold text-primary bg-primary/10 px-3 py-2 rounded-lg">
                            <Zap className="w-4 h-4" />
                            Completed orders sync Inventory & Finance
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end pt-4 border-t border-border">
                        <Button type="submit" size="lg" className="w-full sm:w-auto rounded-xl font-semibold px-8">
                          <Plus className="w-5 h-5 mr-2" />
                          Create Order
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

          </motion.div>
        </div>
      </Tabs>

      {/* ── Edit Order Dialog ── */}
      <Dialog open={!!editingOrder} onOpenChange={open => !open && setEditingOrder(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Order — {editingOrder?.id}</DialogTitle>
          </DialogHeader>
          {editingOrder && (
            <form onSubmit={handleEditSave} className="space-y-4 py-4">
              <div className="space-y-2">
                <FormLabel className="font-semibold">Customer</FormLabel>
                <Input
                  value={editingOrder.customer}
                  onChange={e => setEditingOrder({ ...editingOrder, customer: e.target.value })}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <FormLabel className="font-semibold">Products</FormLabel>
                <Input
                  value={editingOrder.products}
                  onChange={e => setEditingOrder({ ...editingOrder, products: e.target.value })}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <FormLabel className="font-semibold">Payment Method</FormLabel>
                <Select
                  value={editingOrder.payment}
                  onValueChange={v => setEditingOrder({ ...editingOrder, payment: v })}
                >
                  <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Debit Card">Debit Card</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <FormLabel className="font-semibold">Status</FormLabel>
                <Select
                  value={editingOrder.status}
                  onValueChange={v => setEditingOrder({ ...editingOrder, status: v as Order['status'] })}
                >
                  <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Completed">✅ Completed</SelectItem>
                    <SelectItem value="Processing">⏳ Processing</SelectItem>
                    <SelectItem value="Pending">🕐 Pending</SelectItem>
                    <SelectItem value="Cancelled">❌ Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                {editingOrder.status === 'Completed' && (
                  <p className="text-xs text-primary font-medium flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Saving as Completed will update Inventory &amp; Finance
                  </p>
                )}
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" className="rounded-xl" onClick={() => setEditingOrder(null)}>Cancel</Button>
                <Button type="submit" className="rounded-xl">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ── */}
      <AlertDialog open={!!deletingOrder} onOpenChange={open => !open && setDeletingOrder(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete order <strong>{deletingOrder?.id}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
