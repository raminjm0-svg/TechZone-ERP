export const dashboardData = {
  totalSales: 2847320,
  totalProducts: 1842,
  employees: 124,
  customers: 8453,
  monthlySales: [
    { name: 'Jan', total: 340000 },
    { name: 'Feb', total: 420000 },
    { name: 'Mar', total: 380000 },
    { name: 'Apr', total: 450000 },
    { name: 'May', total: 510000 },
    { name: 'Jun', total: 647320 },
  ],
  recentSales: [
    { id: 'ORD-001', customer: 'Alice Johnson', product: 'iPhone 15 Pro', amount: 999.00, date: '2023-10-01', status: 'Completed' },
    { id: 'ORD-002', customer: 'Bob Smith', product: 'Samsung 65" TV', amount: 1299.00, date: '2023-10-02', status: 'Pending' },
    { id: 'ORD-003', customer: 'Charlie Davis', product: 'Dell Laptop XPS', amount: 1599.00, date: '2023-10-02', status: 'Completed' },
    { id: 'ORD-004', customer: 'Diana Prince', product: 'Sony Headphones', amount: 349.00, date: '2023-10-03', status: 'Processing' },
    { id: 'ORD-005', customer: 'Evan Wright', product: 'iPad Air', amount: 599.00, date: '2023-10-03', status: 'Cancelled' },
  ],
  lowStockAlerts: [
    { id: 'PRD-101', name: 'MacBook Pro M2', category: 'Laptops', stock: 2, threshold: 10, status: 'Low Stock' },
    { id: 'PRD-102', name: 'Logitech MX Master 3', category: 'Accessories', stock: 0, threshold: 15, status: 'Out of Stock' },
    { id: 'PRD-103', name: 'Apple Watch Series 9', category: 'Accessories', stock: 4, threshold: 20, status: 'Low Stock' },
    { id: 'PRD-104', name: 'LG OLED 55" TV', category: 'TVs', stock: 1, threshold: 5, status: 'Low Stock' },
    { id: 'PRD-105', name: 'Sony PlayStation 5', category: 'Gaming', stock: 3, threshold: 10, status: 'Low Stock' },
  ]
};

export const salesOrders = [
  { id: 'ORD-101', customer: 'Acme Corp', products: 'Dell XPS 15 (x5)', total: 7995.00, date: '2023-10-10', payment: 'Bank Transfer', status: 'Completed' },
  { id: 'ORD-102', customer: 'Globex Inc', products: 'iPhone 15 Pro (x10)', total: 9990.00, date: '2023-10-11', payment: 'Credit Card', status: 'Processing' },
  { id: 'ORD-103', customer: 'Sarah Connor', products: 'iPad Pro 12.9"', total: 1099.00, date: '2023-10-12', payment: 'Credit Card', status: 'Completed' },
  { id: 'ORD-104', customer: 'Initech', products: 'Lenovo ThinkPad (x8)', total: 9592.00, date: '2023-10-12', payment: 'Bank Transfer', status: 'Pending' },
  { id: 'ORD-105', customer: 'John Doe', products: 'Sony WH-1000XM5', total: 348.00, date: '2023-10-13', payment: 'Debit Card', status: 'Completed' },
  { id: 'ORD-106', customer: 'Stark Industries', products: 'MacBook Pro 16" (x3)', total: 7497.00, date: '2023-10-13', payment: 'Bank Transfer', status: 'Processing' },
  { id: 'ORD-107', customer: 'Wayne Enterprises', products: 'Samsung 85" QLED', total: 3299.00, date: '2023-10-14', payment: 'Credit Card', status: 'Completed' },
  { id: 'ORD-108', customer: 'Jane Smith', products: 'AirPods Pro', total: 249.00, date: '2023-10-14', payment: 'Cash', status: 'Completed' },
  { id: 'ORD-109', customer: 'Massive Dynamic', products: 'HP EliteBook (x20)', total: 23980.00, date: '2023-10-15', payment: 'Bank Transfer', status: 'Pending' },
  { id: 'ORD-110', customer: 'Peter Parker', products: 'Canon EOS R5', total: 3899.00, date: '2023-10-15', payment: 'Credit Card', status: 'Cancelled' },
];

export const productsList = [
  { id: 'PRD-001', name: 'iPhone 15 Pro Max', category: 'Smartphones', brand: 'Apple', price: 1199.00, stock: 45, status: 'In Stock' },
  { id: 'PRD-002', name: 'Galaxy S23 Ultra', category: 'Smartphones', brand: 'Samsung', price: 1199.00, stock: 32, status: 'In Stock' },
  { id: 'PRD-003', name: 'MacBook Pro 16"', category: 'Laptops', brand: 'Apple', price: 2499.00, stock: 12, status: 'Low Stock' },
  { id: 'PRD-004', name: 'ThinkPad X1 Carbon', category: 'Laptops', brand: 'Lenovo', price: 1799.00, stock: 0, status: 'Out of Stock' },
  { id: 'PRD-005', name: 'LG C3 OLED 65"', category: 'TVs', brand: 'LG', price: 1999.00, stock: 8, status: 'Low Stock' },
  { id: 'PRD-006', name: 'Sony A95L 55"', category: 'TVs', brand: 'Sony', price: 2799.00, stock: 15, status: 'In Stock' },
  { id: 'PRD-007', name: 'AirPods Pro 2', category: 'Audio', brand: 'Apple', price: 249.00, stock: 120, status: 'In Stock' },
  { id: 'PRD-008', name: 'WH-1000XM5', category: 'Audio', brand: 'Sony', price: 398.00, stock: 4, status: 'Low Stock' },
  { id: 'PRD-009', name: 'iPad Air 5th Gen', category: 'Tablets', brand: 'Apple', price: 599.00, stock: 25, status: 'In Stock' },
  { id: 'PRD-010', name: 'Galaxy Tab S9', category: 'Tablets', brand: 'Samsung', price: 799.00, stock: 18, status: 'In Stock' },
  { id: 'PRD-011', name: 'Magic Mouse', category: 'Accessories', brand: 'Apple', price: 99.00, stock: 0, status: 'Out of Stock' },
  { id: 'PRD-012', name: 'Anker USB-C Hub', category: 'Accessories', brand: 'Anker', price: 49.00, stock: 85, status: 'In Stock' },
];

export const financeData = {
  summary: {
    totalIncome: 1254300,
    totalExpenses: 843200,
    netProfit: 411100
  },
  transactions: [
    { id: 'TRX-001', type: 'Income', category: 'Sales Revenue', description: 'Monthly B2B Sales', amount: 145000, date: '2023-10-01', reference: 'INV-4401' },
    { id: 'TRX-002', type: 'Expense', category: 'Supplier Payment', description: 'Apple Inc Q3 Stock', amount: 85000, date: '2023-10-02', reference: 'PO-9921' },
    { id: 'TRX-003', type: 'Expense', category: 'Salaries', description: 'September Payroll', amount: 120000, date: '2023-10-03', reference: 'PAY-10' },
    { id: 'TRX-004', type: 'Income', category: 'Sales Revenue', description: 'Retail Store A Weekly', amount: 65400, date: '2023-10-05', reference: 'POS-A-W40' },
    { id: 'TRX-005', type: 'Expense', category: 'Rent', description: 'HQ Office Rent', amount: 15000, date: '2023-10-05', reference: 'RNT-HQ-10' },
    { id: 'TRX-006', type: 'Expense', category: 'Utilities', description: 'Electricity & Internet', amount: 3200, date: '2023-10-08', reference: 'UTL-10' },
    { id: 'TRX-007', type: 'Income', category: 'Sales Revenue', description: 'Online Store Weekly', amount: 98500, date: '2023-10-10', reference: 'WEB-W41' },
    { id: 'TRX-008', type: 'Expense', category: 'Supplier Payment', description: 'Samsung Electronics', amount: 42000, date: '2023-10-12', reference: 'PO-9922' },
    { id: 'TRX-009', type: 'Expense', category: 'Equipment', description: 'New Server Racks', amount: 8500, date: '2023-10-14', reference: 'EQP-44' },
    { id: 'TRX-010', type: 'Income', category: 'Other', description: 'Tax Refund Q2', amount: 12400, date: '2023-10-15', reference: 'TAX-R-Q2' },
  ]
};

export const employeesList = [
  { id: 'EMP-001', name: 'Robert King', department: 'Management', position: 'CEO', email: 'r.king@techzone.com', phone: '555-0101', hireDate: '2015-01-10', status: 'Active' },
  { id: 'EMP-002', name: 'Sarah Jenkins', department: 'HR', position: 'HR Director', email: 's.jenkins@techzone.com', phone: '555-0102', hireDate: '2016-03-15', status: 'Active' },
  { id: 'EMP-003', name: 'Michael Chen', department: 'IT', position: 'Lead Developer', email: 'm.chen@techzone.com', phone: '555-0103', hireDate: '2018-07-22', status: 'Active' },
  { id: 'EMP-004', name: 'Emily Davis', department: 'Sales', position: 'Sales Manager', email: 'e.davis@techzone.com', phone: '555-0104', hireDate: '2019-11-01', status: 'Active' },
  { id: 'EMP-005', name: 'James Wilson', department: 'Finance', position: 'Accountant', email: 'j.wilson@techzone.com', phone: '555-0105', hireDate: '2020-02-14', status: 'On Leave' },
  { id: 'EMP-006', name: 'Lisa Taylor', department: 'Warehouse', position: 'Logistics Coord', email: 'l.taylor@techzone.com', phone: '555-0106', hireDate: '2021-05-10', status: 'Active' },
  { id: 'EMP-007', name: 'David Brown', department: 'IT', position: 'Systems Admin', email: 'd.brown@techzone.com', phone: '555-0107', hireDate: '2021-08-30', status: 'Active' },
  { id: 'EMP-008', name: 'Amanda White', department: 'Sales', position: 'Sales Rep', email: 'a.white@techzone.com', phone: '555-0108', hireDate: '2022-01-15', status: 'Active' },
  { id: 'EMP-009', name: 'Thomas Moore', department: 'Warehouse', position: 'Forklift Operator', email: 't.moore@techzone.com', phone: '555-0109', hireDate: '2022-04-20', status: 'Terminated' },
  { id: 'EMP-010', name: 'Jessica Martin', department: 'Customer Service', position: 'Support Lead', email: 'j.martin@techzone.com', phone: '555-0110', hireDate: '2022-09-05', status: 'Active' },
];

export const customersList = [
  { id: 'CUS-001', name: 'Acme Corporation', email: 'purchasing@acme.com', phone: '555-2001', totalOrders: 45, totalSpent: 124500, memberSince: '2018-04-12', status: 'VIP' },
  { id: 'CUS-002', name: 'John Smith', email: 'john.s@example.com', phone: '555-2002', totalOrders: 12, totalSpent: 4300, memberSince: '2020-08-05', status: 'Active' },
  { id: 'CUS-003', name: 'Globex Industries', email: 'procurement@globex.com', phone: '555-2003', totalOrders: 32, totalSpent: 89000, memberSince: '2019-11-20', status: 'VIP' },
  { id: 'CUS-004', name: 'Mary Johnson', email: 'maryj88@example.com', phone: '555-2004', totalOrders: 4, totalSpent: 1200, memberSince: '2022-02-14', status: 'Active' },
  { id: 'CUS-005', name: 'Initech', email: 'billing@initech.com', phone: '555-2005', totalOrders: 18, totalSpent: 45000, memberSince: '2021-06-30', status: 'Active' },
  { id: 'CUS-006', name: 'Robert Williams', email: 'rwilliams@example.com', phone: '555-2006', totalOrders: 1, totalSpent: 349, memberSince: '2023-01-10', status: 'Inactive' },
  { id: 'CUS-007', name: 'Massive Dynamic', email: 'vendor.management@massive.com', phone: '555-2007', totalOrders: 64, totalSpent: 215000, memberSince: '2017-09-01', status: 'VIP' },
  { id: 'CUS-008', name: 'Patricia Brown', email: 'pattyb@example.com', phone: '555-2008', totalOrders: 8, totalSpent: 2800, memberSince: '2021-12-05', status: 'Active' },
  { id: 'CUS-009', name: 'Stark Enterprises', email: 'tony@stark.com', phone: '555-2009', totalOrders: 112, totalSpent: 450000, memberSince: '2016-05-22', status: 'VIP' },
  { id: 'CUS-010', name: 'Linda Davis', email: 'ldavis@example.com', phone: '555-2010', totalOrders: 0, totalSpent: 0, memberSince: '2023-09-15', status: 'Inactive' },
];

export const supportTickets = [
  { id: 'TKT-1001', customer: 'Acme Corporation', issueType: 'Hardware', subject: 'Server Rack Delivery Delay', priority: 'High', status: 'Open', created: '2023-10-14', assignedTo: 'Jessica Martin' },
  { id: 'TKT-1002', customer: 'John Smith', issueType: 'Software', subject: 'Windows License Key Invalid', priority: 'Medium', status: 'In Progress', created: '2023-10-15', assignedTo: 'Michael Chen' },
  { id: 'TKT-1003', customer: 'Mary Johnson', issueType: 'Return', subject: 'Damaged Screen on Arrival', priority: 'High', status: 'Resolved', created: '2023-10-12', assignedTo: 'Jessica Martin' },
  { id: 'TKT-1004', customer: 'Initech', issueType: 'Billing', subject: 'Invoice #4421 Dispute', priority: 'Medium', status: 'Open', created: '2023-10-15', assignedTo: 'James Wilson' },
  { id: 'TKT-1005', customer: 'Globex Industries', issueType: 'Consulting', subject: 'Office Setup Quote', priority: 'Low', status: 'Closed', created: '2023-10-10', assignedTo: 'Emily Davis' },
  { id: 'TKT-1006', customer: 'Patricia Brown', issueType: 'Technical Support', subject: 'Laptop not charging', priority: 'High', status: 'In Progress', created: '2023-10-16', assignedTo: 'David Brown' },
  { id: 'TKT-1007', customer: 'Stark Enterprises', issueType: 'Account', subject: 'Update Billing Details', priority: 'Low', status: 'Resolved', created: '2023-10-13', assignedTo: 'Jessica Martin' },
  { id: 'TKT-1008', customer: 'Massive Dynamic', issueType: 'Hardware', subject: 'Bulk Order Defect Rate', priority: 'High', status: 'Open', created: '2023-10-16', assignedTo: 'Sarah Jenkins' },
];
