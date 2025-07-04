import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, TrendingUp, TrendingDown, Truck, AlertCircle } from 'lucide-react';
import { useInventory, useTransfers } from '@/hooks/useInventory';

const Warehouse = () => {
  const { data: inventory = [], isLoading: inventoryLoading } = useInventory();
  const { data: transfers = [], isLoading: transfersLoading } = useTransfers();

  const lowStockItems = inventory.filter(item => 
    (item.quantity || 0) <= (item.reorder_level || 10)
  );

  const pendingTransfers = transfers.filter(transfer => 
    transfer.status === 'pending' || transfer.status === 'in_transit'
  );

  if (inventoryLoading || transfersLoading) {
    return (
      <MobileLayout title="Warehouse">
        <div className="p-4 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Warehouse Control">
      <div className="p-4 space-y-4">
        {/* Inventory Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Total Items</p>
                  <p className="text-lg font-bold">{inventory.length}</p>
                </div>
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="p-3">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Low Stock</p>
                  <p className="text-lg font-bold text-destructive">{lowStockItems.length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card className="p-3">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Pending Transfers</p>
                  <p className="text-lg font-bold text-primary">{pendingTransfers.length}</p>
                </div>
                <Truck className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="p-3">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Total Value</p>
                  <p className="text-lg font-bold">${inventory.reduce((sum, item) => sum + ((item.products?.price || 0) * (item.quantity || 0)), 0).toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Card className="bg-destructive/10 border-destructive/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-destructive">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.products?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Current: {item.quantity} | Reorder at: {item.reorder_level}
                    </p>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    Low Stock
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Recent Transfers */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Transfers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {transfers.slice(0, 5).map((transfer) => (
              <div key={transfer.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-sm">Transfer #{transfer.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">
                    {transfer.transfer_items?.length || 0} items • {new Date(transfer.initiated_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge 
                  variant={transfer.status === 'completed' ? 'default' : transfer.status === 'in_transit' ? 'secondary' : 'outline'}
                  className="text-xs"
                >
                  {transfer.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 cursor-pointer hover:bg-accent transition-colors">
            <div className="text-center space-y-2">
              <Truck className="h-8 w-8 mx-auto text-primary" />
              <p className="text-sm font-medium">New Transfer</p>
            </div>
          </Card>
          <Card className="p-4 cursor-pointer hover:bg-accent transition-colors">
            <div className="text-center space-y-2">
              <Package className="h-8 w-8 mx-auto text-primary" />
              <p className="text-sm font-medium">Update Stock</p>
            </div>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Warehouse;