import { useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, TrendingUp, DollarSign, Package, Users, FileText, BarChart3 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSales } from '@/hooks/useSales';
import { useProducts } from '@/hooks/useProducts';
import { useMembers } from '@/hooks/useMembers';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedReport, setSelectedReport] = useState('sales');
  const { data: sales = [], isLoading: salesLoading } = useSales();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: members = [], isLoading: membersLoading } = useMembers();

  if (salesLoading || productsLoading || membersLoading) {
    return (
      <MobileLayout title="Reports">
        <div className="p-4 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </MobileLayout>
    );
  }

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
  ];

  // Calculate metrics from real data
  const today = new Date();
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const todaySales = sales.filter(sale => {
    const saleDate = new Date(sale.created_at);
    return saleDate.toDateString() === today.toDateString();
  });

  const thisMonthSales = sales.filter(sale => {
    const saleDate = new Date(sale.created_at);
    return saleDate >= thisMonth;
  });

  const totalRevenue = thisMonthSales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
  const dailyAverage = totalRevenue / new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const reportData = {
    totalSales: thisMonthSales.length,
    totalRevenue,
    dailyAverage,
    newMembers: members.filter(member => {
      const joinDate = new Date(member.created_at);
      return joinDate >= thisMonth;
    }).length,
  };

  const exportReport = () => {
    const reportName = `${selectedReport}_report_${selectedPeriod}_${new Date().toISOString().split('T')[0]}`;
    
    let csvContent = '';
    let data: any[] = [];
    
    switch (selectedReport) {
      case 'sales':
        data = sales.slice(0, 50); // Limit for demo
        csvContent = 'Sale ID,Date,Amount,Payment Method,Status\n';
        data.forEach(sale => {
          csvContent += `${sale.id.slice(0, 8)},${new Date(sale.created_at).toLocaleDateString()},${sale.total_amount},${sale.payment_method || 'N/A'},${sale.status}\n`;
        });
        break;
      case 'inventory':
        data = products.slice(0, 50);
        csvContent = 'Product,Category,Brand,Price,THC%\n';
        data.forEach(product => {
          csvContent += `${product.name},${product.category || 'N/A'},${product.brand || 'N/A'},${product.price || 0},${product.thc_percentage || 0}\n`;
        });
        break;
      case 'members':
        data = members.slice(0, 50);
        csvContent = 'Name,Email,Role,Join Date\n';
        data.forEach(member => {
          csvContent += `${member.full_name || 'N/A'},${member.email || 'N/A'},${member.role || 'member'},${new Date(member.created_at).toLocaleDateString()}\n`;
        });
        break;
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${reportName}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderSalesReport = () => (
    <div className="space-y-4">
      {/* Sales Overview */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3">
          <div className="text-center">
            <DollarSign className="h-6 w-6 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold">${reportData.totalRevenue.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </div>
        </Card>
        <Card className="p-3">
          <div className="text-center">
            <BarChart3 className="h-6 w-6 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold">{reportData.totalSales}</p>
            <p className="text-xs text-muted-foreground">Total Sales</p>
          </div>
        </Card>
      </div>

      {/* Recent Sales */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Sales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {sales.slice(0, 5).map((sale) => (
            <div key={sale.id} className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Sale #{sale.id.slice(0, 8)}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(sale.created_at).toLocaleDateString()} • {sale.payment_method}
                </p>
              </div>
              <p className="font-semibold">${sale.total_amount.toFixed(2)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderInventoryReport = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3">
          <div className="text-center">
            <Package className="h-6 w-6 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold">{products.length}</p>
            <p className="text-xs text-muted-foreground">Total Products</p>
          </div>
        </Card>
        <Card className="p-3">
          <div className="text-center">
            <TrendingUp className="h-6 w-6 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold">{products.filter(p => p.is_active).length}</p>
            <p className="text-xs text-muted-foreground">Active Products</p>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Product Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {['flower', 'edibles', 'vapes', 'concentrates'].map((category) => {
            const count = products.filter(p => p.category === category).length;
            return (
              <div key={category} className="flex justify-between">
                <span className="text-sm capitalize">{category}</span>
                <span className="text-sm font-medium">{count}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );

  const renderMembersReport = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3">
          <div className="text-center">
            <Users className="h-6 w-6 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold">{members.length}</p>
            <p className="text-xs text-muted-foreground">Total Members</p>
          </div>
        </Card>
        <Card className="p-3">
          <div className="text-center">
            <TrendingUp className="h-6 w-6 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold">{reportData.newMembers}</p>
            <p className="text-xs text-muted-foreground">New This Month</p>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Member Roles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {['admin', 'manager', 'staff', 'member'].map((role) => {
            const count = members.filter(m => m.role === role).length;
            return (
              <div key={role} className="flex justify-between">
                <span className="text-sm capitalize">{role}</span>
                <span className="text-sm font-medium">{count}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );

  const getCurrentReportComponent = () => {
    switch (selectedReport) {
      case 'sales': return renderSalesReport();
      case 'inventory': return renderInventoryReport();
      case 'members': return renderMembersReport();
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
            <CardTitle className="text-base">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-primary">{reportData.totalSales}</p>
                <p className="text-xs text-muted-foreground">Sales</p>
              </div>
              <div>
                <p className="text-lg font-bold text-primary">${reportData.dailyAverage.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">Daily Avg</p>
              </div>
              <div>
                <p className="text-lg font-bold text-primary">{reportData.newMembers}</p>
                <p className="text-xs text-muted-foreground">New Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default Reports;