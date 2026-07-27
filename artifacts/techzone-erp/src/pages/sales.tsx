import { useState } from 'react';
import { Search, Plus, ShoppingCart, MoreHorizontal, Pencil, Trash2, FileText } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { salesOrders } from '@/data/dummyData';
import { useToast } from '@/hooks/use-toast';
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

const newSaleSchema = z.object({
  customerName: z.string().min(2, "Customer name is required"),
  customerEmail: z.string().email("Invalid email address"),
  product: z.string().min(1, "Product selection is required"),
  quantity: z.coerce.number().min(1, "Must be at least 1"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  discount: z.coerce.number().min(0).max(100).default(0),
  notes: z.string().optional(),
});

type NewSaleForm = z.infer<typeof newSaleSchema>;

export default function SalesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('orders');
  const [statusFilter, setStatusFilter] = useState('All');
  const [orders, setOrders] = useState([...salesOrders]);
  const [editingOrder, setEditingOrder] = useState<typeof salesOrders[0] | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<typeof salesOrders[0] | null>(null);
  const { toast } = useToast();

  const filteredOrders = orders
    .filter(order => statusFilter === 'All' || order.status === statusFilter)
    .filter(order => 
      searchTerm === '' ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const form = useForm<NewSaleForm>({
    resolver: zodResolver(newSaleSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      product: '',
      quantity: 1,
      paymentMethod: '',
      discount: 0,
      notes: '',
    }
  });

  const onSubmit = (data: NewSaleForm) => {
    toast({
      title: "Sale Created",
      description: `Order for ${data.customerName} has been processed successfully.`,
    });
    form.reset();
    setActiveTab('orders');
  };

  const handleDelete = () => {
    if (deletingOrder) {
      setOrders(orders.filter(o => o.id !== deletingOrder.id));
      toast({ title: "Order deleted", description: `Order ${deletingOrder.id} has been removed.` });
      setDeletingOrder(null);
    }
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrder) {
      setOrders(orders.map(o => o.id === editingOrder.id ? editingOrder : o));
      toast({ title: "Order updated", description: `Order ${editingOrder.id} has been updated.` });
      setEditingOrder(null);
    }
  };

  const handleViewInvoice = (order: typeof salesOrders[0]) => {
    toast({
      title: "Invoice Ready",
      description: `Invoice for ${order.id} — ${order.customer} — $${order.total}`,
      action: <Button variant="outline" size="sm">Download</Button>
    });
  };

  const getStatusBadgeStyle = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
      case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
      case 'Cancelled': return 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100';
      default: return '';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-xl">
          <ShoppingCart className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Sales</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Manage orders and create new sales transactions.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-secondary rounded-xl">
          <TabsTrigger value="orders" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">Sales Orders</TabsTrigger>
          <TabsTrigger value="new" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">New Sale</TabsTrigger>
        </TabsList>
        
        <div className="mt-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <TabsContent value="orders" className="mt-0">
              <Card className="shadow-sm border-border rounded-2xl overflow-hidden">
                <CardHeader className="pb-6 border-b border-border bg-card">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">Order History</CardTitle>
                      <CardDescription className="font-medium mt-1">Recent transactions across all channels</CardDescription>
                    </div>
                    <div className="relative w-full sm:w-72">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search orders..." 
                        className="pl-10 h-10 rounded-xl bg-secondary/50 border-transparent focus:bg-white focus:border-primary transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                    {['All', 'Completed', 'Processing', 'Pending', 'Cancelled'].map(s => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-semibold transition-colors ${statusFilter === s ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}
                      >
                        {s}
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
                        filteredOrders.map((order) => (
                          <TableRow key={order.id} className="group hover:bg-secondary/20 transition-colors">
                            <TableCell className="font-medium text-xs text-muted-foreground px-6 py-4">{order.id}</TableCell>
                            <TableCell className="font-bold text-foreground py-4">{order.customer}</TableCell>
                            <TableCell className="max-w-[200px] truncate font-medium text-muted-foreground py-4" title={order.products}>{order.products}</TableCell>
                            <TableCell className="text-muted-foreground font-medium py-4">{order.date}</TableCell>
                            <TableCell className="font-medium text-muted-foreground py-4">{order.payment}</TableCell>
                            <TableCell className="text-right font-bold text-foreground py-4">
                              ${order.total.toLocaleString(undefined, {minimumFractionDigits: 2})}
                            </TableCell>
                            <TableCell className="text-right py-4">
                              <Badge className={`px-2.5 py-1 text-xs font-bold border ${getStatusBadgeStyle(order.status)}`}>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right px-6 py-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[160px]">
                                  <DropdownMenuItem onClick={() => handleViewInvoice(order)}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Invoice
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setEditingOrder(order)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Order
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => setDeletingOrder(order)} className="text-rose-600 focus:text-rose-600 focus:bg-rose-50">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
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
            
            <TabsContent value="new" className="mt-0">
              <Card className="shadow-sm border-border rounded-2xl max-w-3xl mx-auto overflow-hidden">
                <CardHeader className="pb-6 border-b border-border bg-card">
                  <CardTitle className="text-xl">Create Sales Order</CardTitle>
                  <CardDescription className="font-medium mt-1">Process a new transaction manually</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <FormField
                          control={form.control}
                          name="customerName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-foreground">Customer Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" className="h-11 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="customerEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-foreground">Customer Email</FormLabel>
                              <FormControl>
                                <Input placeholder="john@example.com" className="h-11 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="product"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel className="font-semibold text-foreground">Product</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue placeholder="Select a product" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="iphone15">iPhone 15 Pro Max ($1,199.00)</SelectItem>
                                  <SelectItem value="samsung65">Samsung 65" QLED TV ($1,499.00)</SelectItem>
                                  <SelectItem value="macbook16">MacBook Pro 16" ($2,499.00)</SelectItem>
                                  <SelectItem value="sonywh">Sony WH-1000XM5 ($348.00)</SelectItem>
                                  <SelectItem value="ipadair">iPad Air 5th Gen ($599.00)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-foreground">Quantity</FormLabel>
                              <FormControl>
                                <Input type="number" min="1" className="h-11 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="discount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-foreground">Discount (%)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" max="100" className="h-11 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel className="font-semibold text-foreground">Payment Method</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue placeholder="Select payment method" />
                                  </SelectTrigger>
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
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel className="font-semibold text-foreground">Order Notes</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Any additional information..." className="resize-none min-h-[100px] rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
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

      {/* Edit Order Dialog */}
      <Dialog open={!!editingOrder} onOpenChange={(open) => !open && setEditingOrder(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
          </DialogHeader>
          {editingOrder && (
            <form onSubmit={handleEditSave} className="space-y-4 py-4">
              <div className="space-y-2">
                <FormLabel className="font-semibold">Customer</FormLabel>
                <Input 
                  value={editingOrder.customer} 
                  onChange={(e) => setEditingOrder({...editingOrder, customer: e.target.value})} 
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <FormLabel className="font-semibold">Products</FormLabel>
                <Input 
                  value={editingOrder.products} 
                  onChange={(e) => setEditingOrder({...editingOrder, products: e.target.value})} 
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <FormLabel className="font-semibold">Payment Method</FormLabel>
                <Select value={editingOrder.payment} onValueChange={(v) => setEditingOrder({...editingOrder, payment: v})}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
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
                <Select value={editingOrder.status} onValueChange={(v) => setEditingOrder({...editingOrder, status: v})}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" className="rounded-xl" onClick={() => setEditingOrder(null)}>Cancel</Button>
                <Button type="submit" className="rounded-xl">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!deletingOrder} onOpenChange={(open) => !open && setDeletingOrder(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete order {deletingOrder?.id}? This action cannot be undone.
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
