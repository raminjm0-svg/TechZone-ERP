import { useState, useMemo } from 'react';
import { Search, Plus, CircleAlert as AlertCircle, Package, Smartphone, Laptop, Tv, Headphones, Tablet, Plug, Gamepad2, MoveHorizontal as MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useERP } from '@/context/ERPContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const productSchema = z.object({
  name:         z.string().min(2, 'Product name is required'),
  category:     z.string().min(1, 'Category is required'),
  brand:        z.string().min(1, 'Brand is required'),
  sku:          z.string().min(3, 'SKU is required'),
  barcode:      z.string().optional(),
  supplier:     z.string().optional(),
  price:        z.coerce.number().min(0.01, 'Price must be greater than 0'),
  stock:        z.coerce.number().min(0, 'Stock cannot be negative'),
  reorderLevel: z.coerce.number().min(0, 'Reorder level cannot be negative'),
  description:  z.string().optional(),
});
type ProductForm = z.infer<typeof productSchema>;

const categories = ['All', 'Smartphones', 'Laptops', 'TVs', 'Audio', 'Tablets', 'Accessories', 'Gaming'];

const getCategoryIcon = (cat: string) => {
  switch (cat) {
    case 'Smartphones': return <Smartphone className="w-5 h-5 text-indigo-600" />;
    case 'Laptops':     return <Laptop     className="w-5 h-5 text-blue-600" />;
    case 'TVs':         return <Tv         className="w-5 h-5 text-emerald-600" />;
    case 'Audio':       return <Headphones className="w-5 h-5 text-violet-600" />;
    case 'Tablets':     return <Tablet     className="w-5 h-5 text-rose-600" />;
    case 'Accessories': return <Plug       className="w-5 h-5 text-amber-600" />;
    case 'Gaming':      return <Gamepad2   className="w-5 h-5 text-orange-600" />;
    default:            return <Package    className="w-5 h-5 text-slate-600" />;
  }
};
const getCategoryBg = (cat: string) => {
  switch (cat) {
    case 'Smartphones': return 'bg-indigo-100';
    case 'Laptops':     return 'bg-blue-100';
    case 'TVs':         return 'bg-emerald-100';
    case 'Audio':       return 'bg-violet-100';
    case 'Tablets':     return 'bg-rose-100';
    case 'Accessories': return 'bg-amber-100';
    case 'Gaming':      return 'bg-orange-100';
    default:            return 'bg-slate-100';
  }
};

export default function InventoryPage() {
  const { products, addProduct, updateProduct } = useERP();
  const { toast } = useToast();

  const [searchTerm,     setSearchTerm]     = useState('');
  const [activeTab,      setActiveTab]      = useState('products');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredProducts = useMemo(() =>
    products
      .filter(p => categoryFilter === 'All' || p.category === categoryFilter)
      .filter(p =>
        !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [products, categoryFilter, searchTerm]
  );

  /** Critical low-stock: stock < 10 (alert banner threshold) */
  const lowStockProducts = useMemo(() => products.filter(p => p.stock < 10), [products]);
  /** Dashboard-level critical: stock < 5 */
  const criticalCount    = useMemo(() => products.filter(p => p.stock < 5).length, [products]);
  const outOfStockCount  = useMemo(() => products.filter(p => p.stock === 0).length, [products]);

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '', category: '', brand: '', sku: '',
      barcode: '', supplier: '',
      price: 0, stock: 0, reorderLevel: 10,
      description: '',
    },
  });

  const onSubmit = (data: ProductForm) => {
    addProduct({
      name:         data.name,
      category:     data.category,
      brand:        data.brand,
      barcode:      data.barcode ?? data.sku,
      supplier:     data.supplier ?? '',
      price:        data.price,
      stock:        data.stock,
      reorderLevel: data.reorderLevel,
    });
    toast({
      title: '📦 Product Added',
      description: `${data.name} added to inventory with ${data.stock} units.`,
    });
    form.reset();
    setActiveTab('products');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-violet-500/10 rounded-xl">
            <Package className="w-8 h-8 text-violet-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Inventory</h1>
            <p className="text-sm font-medium text-muted-foreground mt-1">
              Manage product catalog and stock levels.
            </p>
          </div>
        </div>
        {/* Quick summary pills */}
        <div className="hidden sm:flex items-center gap-2">
          {outOfStockCount > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              {outOfStockCount} Out of Stock
            </span>
          )}
          {criticalCount > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full">
              ⚠ {criticalCount} Critical ({"<"}5 units)
            </span>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-secondary rounded-xl">
          <TabsTrigger value="products" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">Products</TabsTrigger>
          <TabsTrigger value="add"      className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">Add Product</TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>

            <TabsContent value="products" className="mt-0 space-y-6">

              {/* Low Stock Alert Cards */}
              {lowStockProducts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {lowStockProducts.map(p => (
                    <div
                      key={p.id}
                      className={`flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border-l-4 ${
                        p.stock === 0 ? 'border-rose-500' : p.stock < 5 ? 'border-red-400' : 'border-amber-500'
                      } border-y border-r border-y-border border-r-border`}
                    >
                      <div className={`p-2 rounded-lg ${p.stock === 0 ? 'bg-rose-100' : p.stock < 5 ? 'bg-red-100' : 'bg-amber-100'}`}>
                        <AlertCircle className={`w-5 h-5 ${p.stock === 0 ? 'text-rose-600' : p.stock < 5 ? 'text-red-600' : 'text-amber-600'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-sm truncate pr-2">{p.name}</h4>
                          <span className={`text-xs font-bold flex-shrink-0 ${p.stock === 0 ? 'text-rose-600' : p.stock < 5 ? 'text-red-600' : 'text-amber-600'}`}>
                            {p.stock === 0 ? 'Out' : `${p.stock} left`}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{p.category}</p>
                        <Progress
                          value={(p.stock / 10) * 100}
                          className={`h-1.5 mt-2 ${p.stock === 0 ? '[&>div]:bg-rose-500' : p.stock < 5 ? '[&>div]:bg-red-500' : '[&>div]:bg-amber-500'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Card className="shadow-sm border-border rounded-2xl overflow-hidden">
                <CardHeader className="pb-6 border-b border-border bg-card">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">Product Catalog</CardTitle>
                      <CardDescription className="font-medium mt-1">
                        {products.length} products · Stock updates in real-time when sales are completed
                      </CardDescription>
                    </div>
                    <div className="relative w-full sm:w-72">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        className="pl-10 h-10 rounded-xl bg-secondary/50 border-transparent focus:bg-white focus:border-primary transition-colors"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                    {categories.map(c => (
                      <button
                        key={c}
                        onClick={() => setCategoryFilter(c)}
                        className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
                          categoryFilter === c ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-secondary/30">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold text-muted-foreground px-6 py-4">Product</TableHead>
                        <TableHead className="font-semibold text-muted-foreground py-4">Category</TableHead>
                        <TableHead className="font-semibold text-muted-foreground py-4">Supplier</TableHead>
                        <TableHead className="font-semibold text-muted-foreground py-4">Brand</TableHead>
                        <TableHead className="font-semibold text-muted-foreground text-right py-4">Price</TableHead>
                        <TableHead className="font-semibold text-muted-foreground text-right py-4 w-32">Stock</TableHead>
                        <TableHead className="font-semibold text-muted-foreground text-right py-4">Status</TableHead>
                        <TableHead className="font-semibold text-muted-foreground text-right px-6 py-4">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                          <TableRow
                            key={product.id}
                            className={`group hover:bg-secondary/20 transition-colors ${product.stock < 5 ? 'bg-rose-50/30' : ''}`}
                          >
                            <TableCell className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getCategoryBg(product.category)}`}>
                                  {getCategoryIcon(product.category)}
                                </div>
                                <div>
                                  <div className="font-bold text-foreground">{product.name}</div>
                                  <div className="text-xs text-muted-foreground font-medium">{product.barcode || product.id}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium text-muted-foreground py-4">{product.category}</TableCell>
                            <TableCell className="font-medium text-muted-foreground py-4">{product.supplier || '—'}</TableCell>
                            <TableCell className="font-medium text-muted-foreground py-4">{product.brand}</TableCell>
                            <TableCell className="text-right font-bold text-foreground py-4">
                              ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-right py-4">
                              <div className={`font-bold text-sm ${
                                product.stock === 0 ? 'text-rose-600' :
                                product.stock < 5  ? 'text-red-600'  :
                                product.stock < 10 ? 'text-amber-600': 'text-emerald-600'
                              }`}>
                                {product.stock}
                              </div>
                              <Progress
                                value={Math.min((product.stock / 50) * 100, 100)}
                                className={`h-1.5 mt-1.5 bg-secondary ${
                                  product.stock === 0 ? '[&>div]:bg-rose-500' :
                                  product.stock < 5  ? '[&>div]:bg-red-500'  :
                                  product.stock < 10 ? '[&>div]:bg-amber-500' :
                                  '[&>div]:bg-emerald-500'
                                }`}
                              />
                            </TableCell>
                            <TableCell className="text-right py-4">
                              <Badge className={`px-2.5 py-1 text-xs font-bold border ${
                                product.stock === 0  ? 'bg-rose-50   text-rose-700   border-rose-200   hover:bg-rose-100' :
                                product.stock < 5   ? 'bg-red-50    text-red-700    border-red-200    hover:bg-red-100' :
                                product.stock < 10  ? 'bg-amber-50  text-amber-700  border-amber-200  hover:bg-amber-100' :
                                                       'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              }`}>
                                {product.stock === 0 && <AlertCircle className="w-3 h-3 mr-1.5" />}
                                {product.stock === 0 ? 'Out of Stock' :
                                 product.stock < 5  ? '⚠ Critical'  :
                                 product.stock < 10 ? 'Low Stock'   : 'In Stock'}
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
                                  <DropdownMenuItem onClick={() => {
                                    updateProduct(product.id, { stock: product.stock + 10 });
                                    toast({ title: 'Stock Updated', description: `Added 10 units to ${product.name}.` });
                                  }}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Restock (+10)
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() =>
                                    toast({ title: 'Edit Mode', description: `Editing ${product.name}` })
                                  }>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Product
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => toast({ title: 'Deleted', description: `${product.name} removed.` })}
                                    className="text-rose-600 focus:text-rose-600 focus:bg-rose-50"
                                  >
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
                            No products found matching your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Add Product Form ── */}
            <TabsContent value="add" className="mt-0">
              <Card className="shadow-sm border-border rounded-2xl max-w-3xl mx-auto overflow-hidden">
                <CardHeader className="pb-6 border-b border-border bg-card">
                  <CardTitle className="text-xl">Add New Product</CardTitle>
                  <CardDescription className="font-medium mt-1">New products are immediately available for sale</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <FormField control={form.control} name="name" render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="font-semibold text-foreground">Product Name</FormLabel>
                            <FormControl><Input placeholder="e.g. Sony PlayStation 5 Pro" className="h-11 rounded-xl" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="category" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-foreground">Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select category" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {['Smartphones','Laptops','TVs','Audio','Tablets','Accessories','Gaming'].map(c => (
                                  <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="brand" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-foreground">Brand</FormLabel>
                            <FormControl><Input placeholder="e.g. Sony" className="h-11 rounded-xl" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="supplier" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-foreground">Supplier</FormLabel>
                            <FormControl><Input placeholder="e.g. Sony Corporation" className="h-11 rounded-xl" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="sku" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-foreground">SKU</FormLabel>
                            <FormControl><Input placeholder="e.g. SNY-PS5-PRO" className="h-11 rounded-xl" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="barcode" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-foreground">Barcode</FormLabel>
                            <FormControl><Input placeholder="e.g. 4710820111049" className="h-11 rounded-xl" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="price" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-foreground">Price ($)</FormLabel>
                            <FormControl><Input type="number" step="0.01" min="0" className="h-11 rounded-xl" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="stock" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-foreground">Initial Stock Quantity</FormLabel>
                            <FormControl><Input type="number" min="0" className="h-11 rounded-xl" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="reorderLevel" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-foreground">Reorder Alert Level</FormLabel>
                            <FormControl><Input type="number" min="0" className="h-11 rounded-xl" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="font-semibold text-foreground">Product Description</FormLabel>
                            <FormControl><Textarea placeholder="Detailed product specifications..." className="resize-none min-h-[100px] rounded-xl" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                      <div className="flex justify-end pt-4 border-t border-border">
                        <Button type="submit" size="lg" className="w-full sm:w-auto rounded-xl font-semibold px-8 bg-violet-600 hover:bg-violet-700">
                          <Plus className="w-5 h-5 mr-2" />
                          Add Product
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
