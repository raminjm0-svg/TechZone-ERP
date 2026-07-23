import { useState } from 'react';
import { Search, Plus, ShoppingCart } from 'lucide-react';
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
  const { toast } = useToast();

  const filteredOrders = salesOrders.filter(order => 
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

  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'Completed': return 'default';
      case 'Processing': return 'secondary';
      case 'Pending': return 'outline';
      case 'Cancelled': return 'destructive';
      default: return 'default';
    }
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
            transition={{ duration: 0.3 }}
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
                        <TableHead className="font-semibold text-muted-foreground text-right px-6 py-4">Status</TableHead>
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
                            <TableCell className="text-right px-6 py-4">
                              <Badge className={`px-2.5 py-1 text-xs font-bold border ${getStatusBadgeStyle(order.status)}`}>
                                {order.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-32 text-center text-muted-foreground font-medium">
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
    </div>
  );
}
