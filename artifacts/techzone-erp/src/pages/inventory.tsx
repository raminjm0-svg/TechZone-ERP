import { useState } from 'react';
import { Search, Plus, AlertCircle, Package } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { productsList } from '@/data/dummyData';
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

const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  sku: z.string().min(3, "SKU is required"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  reorderLevel: z.coerce.number().min(0, "Reorder level cannot be negative"),
  description: z.string().optional(),
});

type ProductForm = z.infer<typeof productSchema>;

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const { toast } = useToast();

  const filteredProducts = productsList.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      category: '',
      brand: '',
      sku: '',
      price: 0,
      stock: 0,
      reorderLevel: 10,
      description: '',
    }
  });

  const onSubmit = (data: ProductForm) => {
    toast({
      title: "Product Added",
      description: `${data.name} has been added to inventory.`,
    });
    form.reset();
    setActiveTab('products');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-violet-500/10 rounded-xl">
          <Package className="w-8 h-8 text-violet-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Inventory</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Manage product catalog and stock levels.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-secondary rounded-xl">
          <TabsTrigger value="products" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">Products</TabsTrigger>
          <TabsTrigger value="add" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">Add Product</TabsTrigger>
        </TabsList>
        
        <div className="mt-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="products" className="mt-0">
              <Card className="shadow-sm border-border rounded-2xl overflow-hidden">
                <CardHeader className="pb-6 border-b border-border bg-card">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">Product Catalog</CardTitle>
                      <CardDescription className="font-medium mt-1">Current inventory status across all categories</CardDescription>
                    </div>
                    <div className="relative w-full sm:w-72">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search products..." 
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
                        <TableHead className="font-semibold text-muted-foreground px-6 py-4">SKU / ID</TableHead>
                        <TableHead className="font-semibold text-muted-foreground py-4">Product</TableHead>
                        <TableHead className="font-semibold text-muted-foreground py-4">Category</TableHead>
                        <TableHead className="font-semibold text-muted-foreground py-4">Brand</TableHead>
                        <TableHead className="font-semibold text-muted-foreground text-right py-4">Price</TableHead>
                        <TableHead className="font-semibold text-muted-foreground text-right py-4">Stock</TableHead>
                        <TableHead className="font-semibold text-muted-foreground text-right px-6 py-4">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <TableRow key={product.id} className="group hover:bg-secondary/20 transition-colors">
                            <TableCell className="font-medium text-xs text-muted-foreground px-6 py-4">{product.id}</TableCell>
                            <TableCell className="font-bold text-foreground py-4">{product.name}</TableCell>
                            <TableCell className="font-medium text-muted-foreground py-4">{product.category}</TableCell>
                            <TableCell className="font-medium text-muted-foreground py-4">{product.brand}</TableCell>
                            <TableCell className="text-right font-bold text-foreground py-4">
                              ${product.price.toLocaleString(undefined, {minimumFractionDigits: 2})}
                            </TableCell>
                            <TableCell className={`text-right font-bold py-4 ${
                              product.stock === 0 ? 'text-rose-600' : product.stock < 10 ? 'text-amber-600' : 'text-emerald-600'
                            }`}>
                              {product.stock}
                            </TableCell>
                            <TableCell className="text-right px-6 py-4">
                              <Badge className={`px-2.5 py-1 text-xs font-bold border ${
                                product.status === 'In Stock' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 
                                product.status === 'Low Stock' ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' : 
                                'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                              }`}>
                                {product.status === 'Out of Stock' && <AlertCircle className="w-3 h-3 mr-1.5" />}
                                {product.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-32 text-center text-muted-foreground font-medium">
                            No products found matching your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="add" className="mt-0">
              <Card className="shadow-sm border-border rounded-2xl max-w-3xl mx-auto overflow-hidden">
                <CardHeader className="pb-6 border-b border-border bg-card">
                  <CardTitle className="text-xl">Add New Product</CardTitle>
                  <CardDescription className="font-medium mt-1">Enter product details for the catalog</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel className="font-semibold text-foreground">Product Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Sony PlayStation 5 Pro" className="h-11 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-foreground">Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Smartphones">Smartphones</SelectItem>
                                  <SelectItem value="Laptops">Laptops</SelectItem>
                                  <SelectItem value="TVs">TVs</SelectItem>
                                  <SelectItem value="Audio">Audio</SelectItem>
                                  <SelectItem value="Tablets">Tablets</SelectItem>
                                  <SelectItem value="Accessories">Accessories</SelectItem>
                                  <SelectItem value="Gaming">Gaming</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="brand"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-foreground">Brand</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Sony" className="h-11 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="sku"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-foreground">SKU / Barcode</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. SNY-PS5-PRO" className="h-11 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-foreground">Price ($)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" min="0" className="h-11 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="stock"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-foreground">Initial Stock Quantity</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" className="h-11 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="reorderLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-foreground">Reorder Alert Level</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" className="h-11 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel className="font-semibold text-foreground">Product Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Detailed product specifications..." className="resize-none min-h-[100px] rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
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
