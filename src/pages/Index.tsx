import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Package, Users, DollarSign, AlertTriangle, CreditCard } from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { data: dashboardData, isLoading } = useDashboard();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <MobileLayout title="CIMS Dashboard">
        <div className="p-4 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </MobileLayout>
    );
  }

  // Dynamic stats based on real data
  const stats = [
    { 
      title: 'Daily Sales', 
      value: `$${dashboardData?.dailySales?.toFixed(2) || '0.00'}`, 
      change: '+12%', 
      trend: 'up', 
      icon: DollarSign 
    },
    { 
      title: 'Total Products', 
      value: dashboardData?.totalProducts?.toString() || '0', 
      change: '+5', 
      trend: 'up', 
      icon: Package 
    },
    { 
      title: 'Active Members', 
      value: dashboardData?.totalMembers?.toString() || '0', 
      change: '+3', 
      trend: 'up', 
      icon: Users 
    },
    { 
      title: 'Low Stock Items', 
      value: dashboardData?.lowStockCount?.toString() || '0', 
      change: '-2', 
      trend: 'down', 
      icon: AlertTriangle 
    },
  ];

  const recentActivity = [
    ...((dashboardData?.recentSales || []).map((sale, index) => ({
      action: 'Sale completed',
      amount: `$${sale.total_amount.toFixed(2)}`,
      time: new Date(sale.created_at).toLocaleTimeString(),
      type: 'sale'
    }))),
    { action: 'New member joined', name: 'Recent User', time: '1 hour ago', type: 'member' },
  ].slice(0, 4);

  return (
    <MobileLayout title="CIMS Dashboard">
      <div className="p-4 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="p-3">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-medium">{stat.title}</p>
                      <p className="text-lg font-bold">{stat.value}</p>
                      <div className="flex items-center space-x-1">
                        {stat.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                        <span className={`text-xs ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <Icon className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  {(activity as any).amount && (
                    <p className="text-xs text-muted-foreground">{(activity as any).amount}</p>
                  )}
                  {(activity as any).item && (
                    <p className="text-xs text-muted-foreground">{(activity as any).item}</p>
                  )}
                  {(activity as any).name && (
                    <p className="text-xs text-muted-foreground">{(activity as any).name}</p>
                  )}
                </div>
                <div className="text-right">
                  <Badge 
                    variant={activity.type === 'sale' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {activity.type}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card 
            className="p-4 cursor-pointer hover:bg-accent transition-colors"
            onClick={() => navigate('/pos')}
          >
            <div className="text-center space-y-2">
              <CreditCard className="h-8 w-8 mx-auto text-primary" />
              <p className="text-sm font-medium">New Sale</p>
            </div>
          </Card>
          <Card 
            className="p-4 cursor-pointer hover:bg-accent transition-colors"
            onClick={() => navigate('/warehouse')}
          >
            <div className="text-center space-y-2">
              <Package className="h-8 w-8 mx-auto text-primary" />
              <p className="text-sm font-medium">Check Stock</p>
            </div>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Index;
