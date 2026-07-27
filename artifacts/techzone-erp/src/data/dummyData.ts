export const dashboardData = {
  totalSales: 2847320,
  totalOrders: 3891,
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
  { id: 'PRD-001', name: 'iPhone 15 Pro Max', category: 'Smartphones', brand: 'Apple', price: 1199.00, stock: 45, status: 'In Stock', barcode: '4710820111049', supplier: 'Apple Inc', image: null, reorderLevel: 20 },
  { id: 'PRD-002', name: 'Galaxy S23 Ultra', category: 'Smartphones', brand: 'Samsung', price: 1199.00, stock: 32, status: 'In Stock', barcode: '8806090123456', supplier: 'Samsung Electronics', image: null, reorderLevel: 15 },
  { id: 'PRD-003', name: 'MacBook Pro 16"', category: 'Laptops', brand: 'Apple', price: 2499.00, stock: 12, status: 'Low Stock', barcode: '190198123456', supplier: 'Apple Inc', image: null, reorderLevel: 10 },
  { id: 'PRD-004', name: 'ThinkPad X1 Carbon', category: 'Laptops', brand: 'Lenovo', price: 1799.00, stock: 0, status: 'Out of Stock', barcode: '191545678901', supplier: 'Lenovo Global', image: null, reorderLevel: 5 },
  { id: 'PRD-005', name: 'LG C3 OLED 65"', category: 'TVs', brand: 'LG', price: 1999.00, stock: 8, status: 'Low Stock', barcode: '8806087123456', supplier: 'LG Electronics', image: null, reorderLevel: 10 },
  { id: 'PRD-006', name: 'Sony A95L 55"', category: 'TVs', brand: 'Sony', price: 2799.00, stock: 15, status: 'In Stock', barcode: '4548736123456', supplier: 'Sony Corporation', image: null, reorderLevel: 5 },
  { id: 'PRD-007', name: 'AirPods Pro 2', category: 'Audio', brand: 'Apple', price: 249.00, stock: 120, status: 'In Stock', barcode: '190198987654', supplier: 'Apple Inc', image: null, reorderLevel: 50 },
  { id: 'PRD-008', name: 'WH-1000XM5', category: 'Audio', brand: 'Sony', price: 398.00, stock: 4, status: 'Low Stock', barcode: '4548736098765', supplier: 'Sony Corporation', image: null, reorderLevel: 15 },
  { id: 'PRD-009', name: 'iPad Air 5th Gen', category: 'Tablets', brand: 'Apple', price: 599.00, stock: 25, status: 'In Stock', barcode: '190198543210', supplier: 'Apple Inc', image: null, reorderLevel: 10 },
  { id: 'PRD-010', name: 'Galaxy Tab S9', category: 'Tablets', brand: 'Samsung', price: 799.00, stock: 18, status: 'In Stock', barcode: '8806090543210', supplier: 'Samsung Electronics', image: null, reorderLevel: 10 },
  { id: 'PRD-011', name: 'Magic Mouse', category: 'Accessories', brand: 'Apple', price: 99.00, stock: 0, status: 'Out of Stock', barcode: '190198112233', supplier: 'Apple Inc', image: null, reorderLevel: 20 },
  { id: 'PRD-012', name: 'Anker USB-C Hub', category: 'Accessories', brand: 'Anker', price: 49.00, stock: 85, status: 'In Stock', barcode: '848061011223', supplier: 'Anker Innovations', image: null, reorderLevel: 30 },
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
  { id: 'EMP-001', name: 'Robert King', department: 'Management', position: 'CEO', email: 'r.king@techzone.com', phone: '555-0101', hireDate: '2015-01-10', status: 'Active', salary: 180000 },
  { id: 'EMP-002', name: 'Sarah Jenkins', department: 'HR', position: 'HR Director', email: 's.jenkins@techzone.com', phone: '555-0102', hireDate: '2016-03-15', status: 'Active', salary: 120000 },
  { id: 'EMP-003', name: 'Michael Chen', department: 'IT', position: 'Lead Developer', email: 'm.chen@techzone.com', phone: '555-0103', hireDate: '2018-07-22', status: 'Active', salary: 140000 },
  { id: 'EMP-004', name: 'Emily Davis', department: 'Sales', position: 'Sales Manager', email: 'e.davis@techzone.com', phone: '555-0104', hireDate: '2019-11-01', status: 'Active', salary: 110000 },
  { id: 'EMP-005', name: 'James Wilson', department: 'Finance', position: 'Accountant', email: 'j.wilson@techzone.com', phone: '555-0105', hireDate: '2020-02-14', status: 'On Leave', salary: 95000 },
  { id: 'EMP-006', name: 'Lisa Taylor', department: 'Warehouse', position: 'Logistics Coord', email: 'l.taylor@techzone.com', phone: '555-0106', hireDate: '2021-05-10', status: 'Active', salary: 75000 },
  { id: 'EMP-007', name: 'David Brown', department: 'IT', position: 'Systems Admin', email: 'd.brown@techzone.com', phone: '555-0107', hireDate: '2021-08-30', status: 'Active', salary: 98000 },
  { id: 'EMP-008', name: 'Amanda White', department: 'Sales', position: 'Sales Rep', email: 'a.white@techzone.com', phone: '555-0108', hireDate: '2022-01-15', status: 'Active', salary: 70000 },
  { id: 'EMP-009', name: 'Thomas Moore', department: 'Warehouse', position: 'Forklift Operator', email: 't.moore@techzone.com', phone: '555-0109', hireDate: '2022-04-20', status: 'Terminated', salary: 55000 },
  { id: 'EMP-010', name: 'Jessica Martin', department: 'Customer Service', position: 'Support Lead', email: 'j.martin@techzone.com', phone: '555-0110', hireDate: '2022-09-05', status: 'Active', salary: 82000 },
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

export const attendanceRecords = [
  { id: 'ATT-001', employeeId: 'EMP-001', employeeName: 'Robert King', date: '2023-10-25', checkIn: '08:50', checkOut: '17:30', hoursWorked: 8.5, status: 'Present' },
  { id: 'ATT-002', employeeId: 'EMP-002', employeeName: 'Sarah Jenkins', date: '2023-10-25', checkIn: '09:05', checkOut: '17:00', hoursWorked: 7.9, status: 'Late' },
  { id: 'ATT-003', employeeId: 'EMP-003', employeeName: 'Michael Chen', date: '2023-10-25', checkIn: '08:45', checkOut: '18:15', hoursWorked: 9.5, status: 'Present' },
  { id: 'ATT-004', employeeId: 'EMP-004', employeeName: 'Emily Davis', date: '2023-10-25', checkIn: '09:00', checkOut: '17:00', hoursWorked: 8.0, status: 'Present' },
  { id: 'ATT-005', employeeId: 'EMP-005', employeeName: 'James Wilson', date: '2023-10-25', checkIn: '-', checkOut: '-', hoursWorked: 0, status: 'Absent' },
  { id: 'ATT-006', employeeId: 'EMP-006', employeeName: 'Lisa Taylor', date: '2023-10-25', checkIn: '07:55', checkOut: '16:00', hoursWorked: 8.0, status: 'Present' },
  { id: 'ATT-007', employeeId: 'EMP-007', employeeName: 'David Brown', date: '2023-10-25', checkIn: '08:30', checkOut: '12:30', hoursWorked: 4.0, status: 'Half Day' },
  { id: 'ATT-008', employeeId: 'EMP-008', employeeName: 'Amanda White', date: '2023-10-25', checkIn: '09:15', checkOut: '17:45', hoursWorked: 8.5, status: 'Late' },
  { id: 'ATT-009', employeeId: 'EMP-009', employeeName: 'Thomas Moore', date: '2023-10-25', checkIn: '-', checkOut: '-', hoursWorked: 0, status: 'Absent' },
  { id: 'ATT-010', employeeId: 'EMP-010', employeeName: 'Jessica Martin', date: '2023-10-25', checkIn: '08:55', checkOut: '17:05', hoursWorked: 8.1, status: 'Present' },
];

export const leaveRequests = [
  { id: 'LR-001', employeeId: 'EMP-005', employeeName: 'James Wilson', department: 'Finance', leaveType: 'Sick', startDate: '2023-10-24', endDate: '2023-10-26', days: 3, reason: 'Flu', status: 'Approved' },
  { id: 'LR-002', employeeId: 'EMP-009', employeeName: 'Thomas Moore', department: 'Warehouse', leaveType: 'Unpaid', startDate: '2023-10-25', endDate: '2023-10-25', days: 1, reason: 'Personal matters', status: 'Rejected' },
  { id: 'LR-003', employeeId: 'EMP-002', employeeName: 'Sarah Jenkins', department: 'HR', leaveType: 'Annual', startDate: '2023-11-01', endDate: '2023-11-10', days: 8, reason: 'Family vacation', status: 'Approved' },
  { id: 'LR-004', employeeId: 'EMP-007', employeeName: 'David Brown', department: 'IT', leaveType: 'Annual', startDate: '2023-12-20', endDate: '2023-12-31', days: 8, reason: 'Holidays', status: 'Pending' },
  { id: 'LR-005', employeeId: 'EMP-008', employeeName: 'Amanda White', department: 'Sales', leaveType: 'Emergency', startDate: '2023-10-20', endDate: '2023-10-21', days: 2, reason: 'Family emergency', status: 'Approved' },
  { id: 'LR-006', employeeId: 'EMP-003', employeeName: 'Michael Chen', department: 'IT', leaveType: 'Annual', startDate: '2023-11-15', endDate: '2023-11-17', days: 3, reason: 'Conference rest', status: 'Pending' },
  { id: 'LR-007', employeeId: 'EMP-006', employeeName: 'Lisa Taylor', department: 'Warehouse', leaveType: 'Sick', startDate: '2023-10-28', endDate: '2023-10-29', days: 2, reason: 'Medical appointment', status: 'Pending' },
  { id: 'LR-008', employeeId: 'EMP-010', employeeName: 'Jessica Martin', department: 'Customer Service', leaveType: 'Annual', startDate: '2024-01-05', endDate: '2024-01-15', days: 7, reason: 'Travel', status: 'Pending' },
];

export const warrantyRecords = [
  { id: 'WAR-001', customerId: 'CUS-001', customerName: 'Acme Corporation', product: 'Dell XPS 15 (x5)', serial: 'DXPS-9982-1100', purchaseDate: '2023-10-10', expiryDate: '2026-10-10', status: 'Active', coverage: 'Extended' },
  { id: 'WAR-002', customerId: 'CUS-002', customerName: 'John Smith', product: 'Samsung 65" TV', serial: 'SMTV-65-8840', purchaseDate: '2022-11-05', expiryDate: '2023-11-05', status: 'Expiring', coverage: 'Standard' },
  { id: 'WAR-003', customerId: 'CUS-004', customerName: 'Mary Johnson', product: 'iPad Air 5th Gen', serial: 'IPAD-A5-2001', purchaseDate: '2021-08-15', expiryDate: '2022-08-15', status: 'Expired', coverage: 'Standard' },
  { id: 'WAR-004', customerId: 'CUS-005', customerName: 'Initech', product: 'Lenovo ThinkPad (x8)', serial: 'LNV-TP-400X', purchaseDate: '2023-10-12', expiryDate: '2025-10-12', status: 'Active', coverage: 'Extended' },
  { id: 'WAR-005', customerId: 'CUS-008', customerName: 'Patricia Brown', product: 'Sony WH-1000XM5', serial: 'SNY-WH-8877', purchaseDate: '2022-12-01', expiryDate: '2023-12-01', status: 'Expiring', coverage: 'Standard' },
  { id: 'WAR-006', customerId: 'CUS-009', customerName: 'Stark Enterprises', product: 'MacBook Pro 16" (x3)', serial: 'MBP-16-9911', purchaseDate: '2023-10-13', expiryDate: '2026-10-13', status: 'Active', coverage: 'Extended' },
  { id: 'WAR-007', customerId: 'CUS-003', customerName: 'Globex Industries', product: 'iPhone 15 Pro (x10)', serial: 'IP15-P-0012', purchaseDate: '2023-10-11', expiryDate: '2024-10-11', status: 'Active', coverage: 'Standard' },
  { id: 'WAR-008', customerId: 'CUS-007', customerName: 'Massive Dynamic', product: 'HP EliteBook (x20)', serial: 'HP-EB-5544', purchaseDate: '2020-05-10', expiryDate: '2023-05-10', status: 'Expired', coverage: 'Extended' },
];

export const returnRequests = [
  { id: 'RTN-001', customerId: 'CUS-004', customerName: 'Mary Johnson', product: 'iPad Air', orderId: 'ORD-005', reason: 'Defective', requestDate: '2023-10-18', status: 'Approved', refundAmount: 599.00 },
  { id: 'RTN-002', customerId: 'CUS-002', customerName: 'John Smith', product: 'Samsung 65" TV', orderId: 'ORD-002', reason: 'Changed Mind', requestDate: '2023-10-19', status: 'Pending', refundAmount: 1299.00 },
  { id: 'RTN-003', customerId: 'CUS-010', customerName: 'Peter Parker', product: 'Canon EOS R5', orderId: 'ORD-110', reason: 'Wrong Item', requestDate: '2023-10-16', status: 'Completed', refundAmount: 3899.00 },
  { id: 'RTN-004', customerId: 'CUS-008', customerName: 'Patricia Brown', product: 'AirPods Pro', orderId: 'ORD-108', reason: 'Not as Described', requestDate: '2023-10-20', status: 'Pending', refundAmount: 249.00 },
  { id: 'RTN-005', customerId: 'CUS-001', customerName: 'Acme Corporation', product: 'Dell XPS 15', orderId: 'ORD-101', reason: 'Defective', requestDate: '2023-10-22', status: 'Approved', refundAmount: 1599.00 },
  { id: 'RTN-006', customerId: 'CUS-003', customerName: 'Globex Industries', product: 'iPhone 15 Pro', orderId: 'ORD-102', reason: 'Changed Mind', requestDate: '2023-10-15', status: 'Rejected', refundAmount: 999.00 },
  { id: 'RTN-007', customerId: 'CUS-007', customerName: 'Massive Dynamic', product: 'HP EliteBook', orderId: 'ORD-109', reason: 'Defective', requestDate: '2023-10-24', status: 'Pending', refundAmount: 1199.00 },
  { id: 'RTN-008', customerId: 'CUS-005', customerName: 'Initech', product: 'Sony WH-1000XM5', orderId: 'ORD-105', reason: 'Wrong Item', requestDate: '2023-10-25', status: 'Pending', refundAmount: 348.00 },
];
