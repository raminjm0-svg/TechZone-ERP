import { useState } from 'react';
import { Search, UserPlus, Users } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { employeesList } from '@/data/dummyData';
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

const employeeSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(2, "Position is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone is required"),
  hireDate: z.string().min(1, "Hire date is required"),
  salary: z.coerce.number().min(1, "Salary must be greater than 0"),
  employmentType: z.string().min(1, "Employment type is required"),
  address: z.string().optional(),
});

type EmployeeForm = z.infer<typeof employeeSchema>;

export default function HrPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('employees');
  const { toast } = useToast();

  const filteredEmployees = employeesList.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const form = useForm<EmployeeForm>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      department: '',
      position: '',
      email: '',
      phone: '',
      hireDate: new Date().toISOString().split('T')[0],
      salary: 0,
      employmentType: '',
      address: '',
    }
  });

  const onSubmit = (data: EmployeeForm) => {
    toast({
      title: "Employee Added",
      description: `${data.firstName} ${data.lastName} has been added to ${data.department}.`,
    });
    form.reset();
    setActiveTab('employees');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-500/10 rounded-xl">
          <Users className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Human Resources</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Manage personnel, departments, and payroll.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-secondary rounded-xl">
          <TabsTrigger value="employees" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">Directory</TabsTrigger>
          <TabsTrigger value="add" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">Onboard Staff</TabsTrigger>
        </TabsList>
        
        <div className="mt-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="employees" className="mt-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
                {/* We use a grid layout instead of a table to make it feel more premium like an actual directory */}
                <div className="col-span-full mb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Staff Directory</h2>
                      <p className="text-sm font-medium text-muted-foreground mt-1">All active and inactive employees</p>
                    </div>
                    <div className="relative w-full sm:w-72">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search by name, dept..." 
                        className="pl-10 h-10 rounded-xl bg-white border-border shadow-sm focus:border-primary transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => {
                    const initials = emp.name.split(' ').map(n => n[0]).join('');
                    return (
                      <Card key={emp.id} className="shadow-sm border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow group">
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center text-center">
                            <Avatar className="w-20 h-20 mb-4 border-2 border-primary/10">
                              <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">{initials}</AvatarFallback>
                            </Avatar>
                            <h3 className="text-lg font-bold text-foreground leading-tight">{emp.name}</h3>
                            <p className="text-sm font-semibold text-primary mt-1">{emp.position}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-1">{emp.department}</p>
                            
                            <Badge className={`mt-4 px-3 py-1 text-xs font-bold border ${
                              emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 
                              emp.status === 'On Leave' ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' : 
                              'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            }`}>
                              {emp.status}
                            </Badge>

                            <div className="w-full mt-6 pt-6 border-t border-border space-y-3 text-left">
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Email</p>
                                <p className="text-sm font-medium text-foreground truncate" title={emp.email}>{emp.email}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Phone</p>
                                <p className="text-sm font-medium text-foreground">{emp.phone}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-border">
                    <p className="text-muted-foreground font-medium">No employees found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="add" className="mt-0">
              <Card className="shadow-sm border-border rounded-2xl max-w-3xl mx-auto overflow-hidden">
                <CardHeader className="pb-6 border-b border-border bg-card">
                  <CardTitle className="text-xl">Onboard New Employee</CardTitle>
                  <CardDescription className="font-medium mt-1">Enter details to create an employee record</CardDescription>
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
                                <Input placeholder="John" className="h-11 rounded-xl" {...field} />
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
                              <FormLabel className="font-semibold text-foreground">Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" className="h-11 rounded-xl" {...field} />
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
                                <Input placeholder="john.doe@techzone.com" className="h-11 rounded-xl" {...field} />
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
                                <Input placeholder="555-0199" className="h-11 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="department"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-foreground">Department</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue placeholder="Select department" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Sales">Sales</SelectItem>
                                  <SelectItem value="IT">IT</SelectItem>
                                  <SelectItem value="Finance">Finance</SelectItem>
                                  <SelectItem value="HR">HR</SelectItem>
                                  <SelectItem value="Warehouse">Warehouse</SelectItem>
                                  <SelectItem value="Management">Management</SelectItem>
                                  <SelectItem value="Customer Service">Customer Service</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="position"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-foreground">Job Title</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Sales Representative" className="h-11 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="employmentType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-foreground">Employment Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Full-time">Full-time</SelectItem>
                                  <SelectItem value="Part-time">Part-time</SelectItem>
                                  <SelectItem value="Contract">Contract</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="hireDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-foreground">Hire Date</FormLabel>
                              <FormControl>
                                <Input type="date" className="h-11 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="salary"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel className="font-semibold text-foreground">Annual Salary ($)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" className="h-11 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel className="font-semibold text-foreground">Home Address</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Full address..." className="resize-none min-h-[100px] rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end pt-4 border-t border-border">
                        <Button type="submit" size="lg" className="w-full sm:w-auto rounded-xl font-semibold px-8 bg-blue-600 hover:bg-blue-700">
                          <UserPlus className="w-5 h-5 mr-2" />
                          Add Employee
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
