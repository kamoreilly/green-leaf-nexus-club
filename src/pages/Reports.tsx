import { useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, TrendingUp, DollarSign, Package, Users, FileText, BarChart3 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedReport, setSelectedReport] = useState('sales');

  const periods = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
  ];

  const reportTypes = [
    { value: 'sales', label: 'Sales Report', icon: DollarSign },
    { value: 'inventory', label: 'Inventory Report', icon: Package },
    { value: 'members', label: 'Member Report', icon: Users },
    { value: 'cashup', label: 'Cash Up Report', icon: FileText },
  ];

  // Mock data for cash ups
  const cashUps = [
    {
      id: '1',
      date: '2024-01-21',
      cashier: 'John Doe',
      store: 'Main Store',
      openingCash: 200.00,
      closingCash: 1250.00,
      expectedCash: 1245.50,
      difference: 4.50,
      totalSales: 1045.50,
      status: 'approved',
    },
    {
      id: '2',
      date: '2024-01-20',
      cashier: 'Sarah Wilson',
      store: 'Downtown Branch',
      openingCash: 150.00,
      closingCash: 950.00,
      expectedCash: 960.25,
      difference: -10.25,
      totalSales: 810.25,
      status: 'discrepancy',
    },
    {
      id: '3',
      date: '2024-01-20',
      cashier: 'Mike Johnson',
      store: 'Northside Location',
      openingCash: 175.00,
      closingCash: 825.00,
      expectedCash: 825.00,
      difference: 0.00,
      totalSales: 650.00,
      status: 'approved',
    },
  ];

  // Mock sales data
  const salesData = {
    totalSales: 2847.50,
    totalTransactions: 43,
    averageTransaction: 66.22,
    topProducts: [
      { name: 'Blue Dream', sales: 450.00, units: 10 },
      { name: 'Gummy Bears', sales: 375.00, units: 15 },
      { name: 'Live Resin Cart', sales: 325.00, units: 5 },
    ],
    paymentMethods: {
      cash: 45,
      card: 35,
      digital: 20,
    },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'discrepancy': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  const exportReport = () => {
    // Mock export functionality
    console.log(`Exporting ${selectedReport} report for ${selectedPeriod}`);
  };

  const renderSalesReport = () => (
    <div className="space-y-4">
      {/* Sales Overview */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3">
          <div className="text-center">
            <DollarSign className="h-6 w-6 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold">${salesData.totalSales}</p>
            <p className="text-xs text-muted-foreground">Total Sales</p>
          </div>
        </Card>
        <Card className="p-3">
          <div className="text-center">
            <BarChart3 className="h-6 w-6 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold">{salesData.totalTransactions}</p>
            <p className="text-xs text-muted-foreground">Transactions</p>
          </div>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Top Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {salesData.topProducts.map((product, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.units} units</p>
              </div>
              <p className="font-semibold">${product.sales}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Cash</span>
              <span className="text-sm font-medium">{salesData.paymentMethods.cash}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Card</span>
              <span className="text-sm font-medium">{salesData.paymentMethods.card}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Digital</span>
              <span className="text-sm font-medium">{salesData.paymentMethods.digital}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCashUpReport = () => (
    <div className="space-y-3">
      {cashUps.map((cashUp) => (
        <Card key={cashUp.id}>
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm">{cashUp.store}</p>
                  <p className="text-xs text-muted-foreground">{cashUp.cashier}</p>
                  <p className="text-xs text-muted-foreground">{cashUp.date}</p>
                </div>
                <Badge variant={getStatusColor(cashUp.status)} className="text-xs">
                  {cashUp.status}
                </Badge>
              </div>

              {/* Cash Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Opening Cash</p>
                  <p className="font-semibold">${cashUp.openingCash.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Closing Cash</p>
                  <p className="font-semibold">${cashUp.closingCash.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Expected Cash</p>
                  <p className="font-semibold">${cashUp.expectedCash.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Difference</p>
                  <p className={`font-semibold ${
                    cashUp.difference > 0 ? 'text-green-600' : 
                    cashUp.difference < 0 ? 'text-red-600' : ''
                  }`}>
                    ${cashUp.difference > 0 ? '+' : ''}${cashUp.difference.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Total Sales */}
              <div className="pt-2 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Sales</span>
                  <span className="font-semibold">${cashUp.totalSales.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const getCurrentReportComponent = () => {
    switch (selectedReport) {
      case 'sales': return renderSalesReport();
      case 'cashup': return renderCashUpReport();
      case 'inventory': return <div className="text-center py-8 text-muted-foreground">Inventory report coming soon</div>;
      case 'members': return <div className="text-center py-8 text-muted-foreground">Member report coming soon</div>;
      default: return renderSalesReport();
    }
  };

  return (
    <MobileLayout title="Reports & Data">
      <div className="p-4 space-y-4">
        {/* Filters */}
        <div className="space-y-2">
          <Select value={selectedReport} onValueChange={setSelectedReport}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              {reportTypes.map(type => {
                const Icon = type.icon;
                return (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center">
                      <Icon className="h-4 w-4 mr-2" />
                      {type.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {periods.map(period => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Export Button */}
        <Button onClick={exportReport} className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>

        {/* Report Content */}
        {getCurrentReportComponent()}

        {/* Quick Stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Data Export Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Export to PDF
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default Reports;