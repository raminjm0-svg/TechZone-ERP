import React, { useState } from 'react';
import { Search, UserPlus, HeartHandshake } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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

  const getPriorityBadgeVariant = (priority: string) => {
    switch(priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'Open': return 'destructive';
      case 'In Progress': return 'secondary';
      case 'Resolved': return 'default';
      case 'Closed': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customer Service</h1>
        <p className="text-muted-foreground mt-1">Manage client relationships and support tickets.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-3">
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="add">Add Customer</TabsTrigger>
        </TabsList>
        
        <TabsContent value="customers" className="space-y-4 mt-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Customer Database</CardTitle>
                  <CardDescription>Client records and purchase history</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search customers..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-center">Orders</TableHead>
                      <TableHead className="text-right">LTV</TableHead>
                      <TableHead>Member Since</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((cus) => (
                        <TableRow key={cus.id} data-testid={`row-cus-${cus.id}`}>
                          <TableCell>
                            <div className="font-medium">{cus.name}</div>
                            <div className="text-xs text-muted-foreground">{cus.id}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{cus.email}</div>
                            <div className="text-xs text-muted-foreground">{cus.phone}</div>
                          </TableCell>
                          <TableCell className="text-center font-medium">{cus.totalOrders}</TableCell>
                          <TableCell className="text-right font-medium">
                            ${cus.totalSpent.toLocaleString(undefined, {minimumFractionDigits: 0})}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{cus.memberSince}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline" className={
                              cus.status === 'VIP' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 
                              cus.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                              'bg-slate-100 text-slate-700 border-slate-200'
                            }>
                              {cus.status === 'VIP' && <HeartHandshake className="w-3 h-3 mr-1" />}
                              {cus.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                          No customers found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tickets" className="mt-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Active Tickets</CardTitle>
              <CardDescription>Support requests needing attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket ID</TableHead>
                      <TableHead>Customer / Subject</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supportTickets.map((tkt) => (
                      <TableRow key={tkt.id} data-testid={`row-tkt-${tkt.id}`}>
                        <TableCell className="font-medium text-xs text-muted-foreground">{tkt.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{tkt.subject}</div>
                          <div className="text-xs text-muted-foreground">{tkt.customer} • Opened: {tkt.created}</div>
                        </TableCell>
                        <TableCell>{tkt.issueType}</TableCell>
                        <TableCell>{tkt.assignedTo}</TableCell>
                        <TableCell>
                          <Badge variant={getPriorityBadgeVariant(tkt.priority)}>{tkt.priority}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={getStatusBadgeVariant(tkt.status)}>{tkt.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="mt-6">
          <Card className="shadow-sm max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Register Client</CardTitle>
              <CardDescription>Add a new customer to the database</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane" {...field} />
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
                          <FormLabel>Last Name (or Company)</FormLabel>
                          <FormControl>
                            <Input placeholder="Smith" {...field} />
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
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="jane@example.com" {...field} />
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
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="555-0211" {...field} />
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
                          <FormLabel>Customer Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
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
                          <FormLabel>Billing Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Full address..." className="resize-none" {...field} />
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
                          <FormLabel>Account Notes</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Preferences, special terms..." className="resize-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button type="submit" size="lg" className="w-full sm:w-auto">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Customer
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
