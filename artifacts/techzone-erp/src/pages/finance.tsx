import { useState } from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, Briefcase, TrendingUp, Search } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { financeData } from '@/data/dummyData';
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
import { StatCard } from '@/components/StatCard';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';

const transactionSchema = z.object({
  type: z.string().min(1, "Type is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(3, "Description is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

type TransactionForm = z.infer<typeof transactionSchema>;

const monthlyData = [
  { month: 'Jan', income: 210000, expenses: 140000 },
  { month: 'Feb', income: 195000, expenses: 128000 },
  { month: 'Mar', income: 230000, expenses: 155000 },
  { month: 'Apr', income: 248000, expenses: 162000 },
  { month: 'May', income: 265000, expenses: 170000 },
  { month: 'Jun', income: 305000, expenses: 188000 },
];

const budgetData = [
  { name: 'Salaries', budget: 150000, actual: 145000 },
  { name: 'Rent', budget: 20000, actual: 20000 },
  { name: 'Supplier Payments', budget: 100000, actual: 115000 },
  { name: 'Utilities', budget: 5000, actual: 4800 },
];

export default function FinancePage() {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('transactions');
  const { toast } = useToast();

  const filteredTransactions = financeData.transactions
    .filter(t => filter === 'All' ? true : t.type === filter)
    .filter(t => 
      searchTerm === '' ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const form = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: '',
      category: '',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: '',
      referenceNumber: '',
      notes: '',
    }
  });

  const onSubmit = (data: TransactionForm) => {
    toast({
      title: "Transaction Logged",
      description: `${data.type} of $${data.amount} has been recorded.`,
    });
    form.reset();
    setActiveTab('transactions');
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const profitMargin = ((financeData.summary.netProfit / financeData.summary.totalIncome) * 100).toFixed(1);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-emerald-500/10 rounded-xl">
          <DollarSign className="w-8 h-8 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Finance</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Monitor cash flow, revenue, and expenses.</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Income"
          value={formatCurrency(financeData.summary.totalIncome)}
          icon={<ArrowUpRight className="w-5 h-5" />}
          accent="green"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(financeData.summary.totalExpenses)}
          icon={<ArrowDownRight className="w-5 h-5" />}
          accent="rose"
        />
        <StatCard
          title="Net Profit"
          value={formatCurrency(financeData.summary.netProfit)}
          icon={<Briefcase className="w-5 h-5" />}
          accent="blue"
        />
        <StatCard
          title="Profit Margin"
          value={`${profitMargin}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          accent="violet"
        />
      </div>

      <Card className="shadow-sm border-border rounded-2xl overflow-hidden">
        <CardHeader className="pb-6 border-b border-border bg-card">
          <CardTitle className="text-xl">Monthly Overview</CardTitle>
          <CardDescription className="font-medium mt-1">Income vs Expenses over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent className="p-6 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val / 1000}k`} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const inc = payload.find(p => p.dataKey === 'income')?.value as number;
                    const exp = payload.find(p => p.dataKey === 'expenses')?.value as number;
                    return (
                      <div className="bg-white p-4 border border-border rounded-xl shadow-lg">
                        <p className="font-bold text-sm mb-2">{label}</p>
                        <div className="space-y-1">
                          <p className="text-sm"><span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>Income: <span className="font-medium">${inc.toLocaleString()}</span></p>
                          <p className="text-sm"><span className="inline-block w-3 h-3 rounded-full bg-rose-500 mr-2"></span>Expenses: <span className="font-medium">${exp.toLocaleString()}</span></p>
                          <p className="text-sm border-t border-border mt-2 pt-2"><span className="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>Profit: <span className="font-bold text-emerald-600">${(inc - exp).toLocaleString()}</span></p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="income" name="Income" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="expenses" name="Expenses" fill="#F43F5E" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-secondary rounded-xl">
          <TabsTrigger value="transactions" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">Transactions</TabsTrigger>
          <TabsTrigger value="add" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">Add Transaction</TabsTrigger>
        </TabsList>
        
        <div className="mt-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <TabsContent value="transactions" className="mt-0 space-y-6">
              
              {/* Budget vs Actual Card */}
              <Card className="shadow-sm border-border rounded-2xl overflow-hidden mb-6">
                <CardHeader className="pb-4 bg-card">
                  <CardTitle className="text-lg">Budget vs Actual</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    {budgetData.map(item => {
                      const pct = Math.min((item.actual / item.budget) * 100, 100);
                      const isOver = item.actual > item.budget;
                      return (
                        <div key={item.name}>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-bold text-foreground">{item.name}</span>
                            <span className="font-medium text-muted-foreground">${item.actual.toLocaleString()} / ${item.budget.toLocaleString()}</span>
                          </div>
                          <Progress 
                            value={pct} 
                            className={`h-2 bg-secondary ${isOver ? '[&>div]:bg-rose-500' : pct > 80 ? '[&>div]:bg-amber-500' : '[&>div]:bg-blue-500'}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-border rounded-2xl overflow-hidden">
                <CardHeader className="pb-6 border-b border-border bg-card">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">Ledger</CardTitle>
                      <CardDescription className="font-medium mt-1">Recent financial activities</CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Search..." 
                          className="pl-10 h-10 rounded-xl bg-secondary/50 border-transparent focus:bg-white focus:border-primary transition-colors"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-1 p-1 bg-secondary rounded-lg">
                        {['All', 'Income', 'Expense'].map(f => (
                          <button
                            key={f}
                            className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all ${filter === f ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setFilter(f)}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-secondary/30">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold text-muted-foreground px-6 py-4">Ref</TableHead>
                        <TableHead className="font-semibold text-muted-foreground py-4">Date</TableHead>
                        <TableHead className="font-semibold text-muted-foreground py-4">Description</TableHead>
                        <TableHead className="font-semibold text-muted-foreground py-4">Category</TableHead>
                        <TableHead className="font-semibold text-muted-foreground py-4">Type</TableHead>
                        <TableHead className="font-semibold text-muted-foreground text-right px-6 py-4">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((tx) => (
                          <TableRow key={tx.id} className="group hover:bg-secondary/20 transition-colors">
                            <TableCell className="font-medium text-xs text-muted-foreground px-6 py-4">{tx.reference}</TableCell>
                            <TableCell className="font-medium text-muted-foreground py-4">{tx.date}</TableCell>
                            <TableCell className="font-bold text-foreground py-4">{tx.description}</TableCell>
                            <TableCell className="font-medium text-muted-foreground py-4">{tx.category}</TableCell>
                            <TableCell className="py-4">
                              <Badge className={`px-2.5 py-1 text-xs font-bold border ${
                                tx.type === 'Income' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 
                                'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                              }`}>
                                {tx.type}
                              </Badge>
                            </TableCell>
                            <TableCell className={`text-right font-bold px-6 py-4 ${tx.type === 'Income' ? 'text-emerald-600' : 'text-foreground'}`}>
                              {tx.type === 'Income' ? '+' : '-'}{formatCurrency(tx.amount)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-32 text-center text-muted-foreground font-medium">
                            No transactions found for this filter.
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
                  <CardTitle className="text-xl">Record Transaction</CardTitle>
                  <CardDescription className="font-medium mt-1">Manually log a financial entry</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-foreground">Transaction Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Income">Income</SelectItem>
                                  <SelectItem value="Expense">Expense</SelectItem>
                                </SelectContent>
                              </Select>
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
                                  <SelectItem value="Sales Revenue">Sales Revenue</SelectItem>
                                  <SelectItem value="Supplier Payment">Supplier Payment</SelectItem>
                                  <SelectItem value="Salaries">Salaries</SelectItem>
                                  <SelectItem value="Utilities">Utilities</SelectItem>
                                  <SelectItem value="Rent">Rent</SelectItem>
                                  <SelectItem value="Equipment">Equipment</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel className="font-semibold text-foreground">Description</FormLabel>
                              <FormControl>
                                <Input placeholder="What was this for?" className="h-11 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-foreground">Amount ($)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" min="0" className="h-11 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-foreground">Date</FormLabel>
                              <FormControl>
                                <Input type="date" className="h-11 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-foreground">Payment Method</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue placeholder="Select method" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                                  <SelectItem value="Cash">Cash</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="referenceNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-foreground">Reference Number</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. INV-123" className="h-11 rounded-xl" {...field} />
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
                              <FormLabel className="font-semibold text-foreground">Notes</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Additional details..." className="resize-none min-h-[100px] rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end pt-4 border-t border-border">
                        <Button type="submit" size="lg" className="w-full sm:w-auto rounded-xl font-semibold px-8 bg-emerald-600 hover:bg-emerald-700">
                          Log Transaction
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
