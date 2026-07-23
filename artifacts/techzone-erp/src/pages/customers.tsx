import { useState } from 'react';
import { Search, UserPlus, HeartHandshake, Headphones } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { customersList, supportTickets } from '@/data/dummyData';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const customerSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone is required"),
  customerType: z.string().min(1, "Type is required"),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type CustomerForm = z.infer<typeof customerSchema>;

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('customers');
  const { toast } = useToast();

  const filteredCustomers = customersList.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const form = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      customerType: '',
      address: '',
      notes: '',
    }
  });

  const onSubmit = (data: CustomerForm) => {
    toast({
      title: "Customer Created",
      description: `${data.firstName} ${data.lastName} added to CRM.`,
    });
    form.reset();
    setActiveTab('customers');
  };

  const getPriorityBadgeStyle = (priority: string) => {
    switch(priority) {
      case 'High': return 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
      case 'Low': return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
      default: return '';
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch(status) {
      case 'Open': return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case 'Resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
      case 'Closed': return 'bg-secondary text-muted-foreground border-border hover:bg-secondary/80';
      default: return '';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-amber-500/10 rounded-xl">
          <Headphones className="w-8 h-8 text-amber-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Customer Service</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Manage client relationships and support tickets.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3 p-1 bg-secondary rounded-xl">
          <TabsTrigger value="customers" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">Customers</TabsTrigger>
          <TabsTrigger value="tickets" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">Support Tickets</TabsTrigger>
          <TabsTrigger value="add" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">Add Customer</TabsTrigger>
        </TabsList>
        
        <div className="mt-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="customers" className="mt-0">
              <Card className="shadow-sm border-border rounded-2xl overflow-hidden">
                <CardHeader className="pb-6 border-b border-border bg-card">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">Customer Database</CardTitle>
                      <CardDescription className="font-medium mt-1">Client records and purchase history</CardDescription>
                    </div>
                    <div className="relative w-full sm:w-72">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search customers..." 
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
                        <TableHead className="font-semibold text-muted-foreground px-6 py-4">Customer</TableHead>
                        <TableHead className="font-semibold text-muted-foreground py-4">Contact</TableHead>
                        <TableHead className="font-semibold text-muted-foreground text-center py-4">Orders</TableHead>
                        <TableHead className="font-semibold text-muted-foreground text-right py-4">Lifetime Value</TableHead>
                        <TableHead className="font-semibold text-muted-foreground py-4">Member Since</TableHead>
                        <TableHead className="font-semibold text-muted-foreground text-right px-6 py-4">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((cus) => {
                          const initials = cus.name.split(' ').map(n => n[0]).join('').substring(0, 2);
                          return (
                            <TableRow key={cus.id} className="group hover:bg-secondary/20 transition-colors">
                              <TableCell className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-9 w-9 border border-border">
                                    <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">{initials}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-bold text-foreground">{cus.name}</div>
                                    <div className="text-xs font-medium text-muted-foreground">{cus.id}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="text-sm font-medium text-foreground">{cus.email}</div>
                                <div className="text-xs font-medium text-muted-foreground">{cus.phone}</div>
                              </TableCell>
                              <TableCell className="text-center font-bold text-foreground py-4">{cus.totalOrders}</TableCell>
                              <TableCell className="text-right font-bold text-foreground py-4">
                                ${cus.totalSpent.toLocaleString(undefined, {minimumFractionDigits: 0})}
                              </TableCell>
                              <TableCell className="text-muted-foreground font-medium py-4">{cus.memberSince}</TableCell>
                              <TableCell className="text-right px-6 py-4">
                                <Badge className={`px-2.5 py-1 text-xs font-bold border ${
                                  cus.status === 'VIP' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' : 
                                  cus.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 
                                  'bg-secondary text-muted-foreground border-border hover:bg-secondary/80'
                                }`}>
                                  {cus.status === 'VIP' && <HeartHandshake className="w-3 h-3 mr-1.5" />}
                                  {cus.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-32 text-center text-muted-foreground font-medium">
                            No customers found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tickets" className="mt-0">
              <Card className="shadow-sm border-border rounded-2xl overflow-hidden">
                <CardHeader className="pb-6 border-b border-border bg-card">
                  <CardTitle className="text-xl">Active Tickets</CardTitle>
                  <CardDescription className="font-medium mt-1">Support requests needing attention</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-secondary/30">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold text-muted-foreground px-6 py-4">Ticket ID</TableHead>
                        <TableHead className="font-semibold text-muted-foreground py-4">Subject</TableHead>
                        <TableHead className="font-semibold text-muted-foreground py-4">Category</TableHead>
                        <TableHead className="font-semibold text-muted-foreground py-4">Assigned To</TableHead>
                        <TableHead className="font-semibold text-muted-foreground py-4">Priority</TableHead>
                        <TableHead className="font-semibold text-muted-foreground text-right px-6 py-4">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supportTickets.map((tkt) => (
                        <TableRow key={tkt.id} className="group hover:bg-secondary/20 transition-colors">
                          <TableCell className="font-medium text-xs text-muted-foreground px-6 py-4">{tkt.id}</TableCell>
                          <TableCell className="py-4">
                            <div className="font-bold text-foreground">{tkt.subject}</div>
                            <div className="text-xs font-medium text-muted-foreground mt-0.5">{tkt.customer} • Opened: {tkt.created}</div>
                          </TableCell>
                          <TableCell className="font-medium text-muted-foreground py-4">{tkt.issueType}</TableCell>
                          <TableCell className="font-medium text-muted-foreground py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                                {tkt.assignedTo.split(' ').map(n => n[0]).join('')}
                              </div>
                              {tkt.assignedTo}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge className={`px-2.5 py-1 text-xs font-bold border ${getPriorityBadgeStyle(tkt.priority)}`}>
                              {tkt.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right px-6 py-4">
                            <Badge className={`px-2.5 py-1 text-xs font-bold border ${getStatusBadgeStyle(tkt.status)}`}>
                              {tkt.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="add" className="mt-0">
              <Card className="shadow-sm border-border rounded-2xl max-w-3xl mx-auto overflow-hidden">
                <CardHeader className="pb-6 border-b border-border bg-card">
                  <CardTitle className="text-xl">Register Client</CardTitle>
                  <CardDescription className="font-medium mt-1">Add a new customer to the database</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-foreground">First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Jane" className="h-11 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-foreground">Last Name (or Company)</FormLabel>
                              <FormControl>
                                <Input placeholder="Smith" className="h-11 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-foreground">Email Address</FormLabel>
                              <FormControl>
                                <Input placeholder="jane@example.com" className="h-11 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-foreground">Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="555-0211" className="h-11 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="customerType"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel className="font-semibold text-foreground">Customer Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Regular">Regular Retail</SelectItem>
                                  <SelectItem value="VIP">VIP</SelectItem>
                                  <SelectItem value="Wholesale">B2B / Wholesale</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel className="font-semibold text-foreground">Billing Address</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Full address..." className="resize-none min-h-[100px] rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel className="font-semibold text-foreground">Account Notes</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Preferences, special terms..." className="resize-none min-h-[100px] rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end pt-4 border-t border-border">
                        <Button type="submit" size="lg" className="w-full sm:w-auto rounded-xl font-semibold px-8 bg-amber-500 hover:bg-amber-600 text-white">
                          <UserPlus className="w-5 h-5 mr-2" />
                          Add Customer
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
