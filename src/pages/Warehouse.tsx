import { useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, ArrowRight, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Warehouse = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewTransfer, setShowNewTransfer] = useState(false);

  // Mock data
  const stores = [
    { id: '1', name: 'Main Store', address: '123 Main St', isWarehouse: true },
    { id: '2', name: 'Downtown Branch', address: '456 Downtown Ave', isWarehouse: false },
    { id: '3', name: 'Northside Location', address: '789 North Blvd', isWarehouse: false },
  ];

  const transfers = [
    {
      id: '1',
      fromStore: 'Main Store',
      toStore: 'Downtown Branch',
      status: 'pending',
      items: 3,
      totalValue: 450.00,
      initiatedAt: '2024-01-21T10:30:00',
      notes: 'Weekly restock',
    },
    {
      id: '2',
      fromStore: 'Main Store',
      toStore: 'Northside Location',
      status: 'in_transit',
      items: 5,
      totalValue: 650.00,
      initiatedAt: '2024-01-21T09:15:00',
      notes: 'Low stock items',
    },
    {
      id: '3',
      fromStore: 'Downtown Branch',
      toStore: 'Main Store',
      status: 'received',
      items: 2,
      totalValue: 150.00,
      initiatedAt: '2024-01-20T14:20:00',
      receivedAt: '2024-01-21T11:45:00',
      notes: 'Return transfer',
    },
  ];

  const lowStockItems = [
    { store: 'Downtown Branch', product: 'Blue Dream', current: 2, needed: 8 },
    { store: 'Northside Location', product: 'Gummy Bears', current: 1, needed: 5 },
    { store: 'Downtown Branch', product: 'Live Resin Cart', current: 3, needed: 7 },
  ];

  const statuses = ['all', 'pending', 'in_transit', 'received', 'cancelled'];

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = transfer.fromStore.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.toStore.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transfer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in_transit': return <Truck className="h-4 w-4" />;
      case 'received': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'in_transit': return 'default';
      case 'received': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const NewTransferDialog = () => (
    <Dialog open={showNewTransfer} onOpenChange={setShowNewTransfer}>
      <DialogContent className="w-[95vw] max-w-md">
        <DialogHeader>
          <DialogTitle>New Transfer</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">From Store</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select source store" />
              </SelectTrigger>
              <SelectContent>
                {stores.map(store => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">To Store</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select destination store" />
              </SelectTrigger>
              <SelectContent>
                {stores.filter(s => !s.isWarehouse).map(store => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Notes</label>
            <Input placeholder="Transfer notes..." />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowNewTransfer(false)}>
              Cancel
            </Button>
            <Button className="flex-1">
              Create Transfer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <MobileLayout title="Warehouse Control">
      <div className="p-4 space-y-4">
        {/* Search and Filters */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transfers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button size="icon" onClick={() => setShowNewTransfer(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Card className="bg-destructive/10 border-destructive/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-destructive flex items-center">
                <Truck className="h-4 w-4 mr-2" />
                Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-xs">
                  <span>{item.store} - {item.product}</span>
                  <span className="text-destructive">
                    {item.current}/{item.needed} units
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Transfer List */}
        <div className="space-y-3">
          {filteredTransfers.map((transfer) => (
            <Card key={transfer.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(transfer.status)}
                      <Badge variant={getStatusColor(transfer.status)} className="text-xs">
                        {transfer.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      #{transfer.id}
                    </span>
                  </div>

                  {/* Transfer Route */}
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 text-center">
                      <p className="text-sm font-medium">{transfer.fromStore}</p>
                      <p className="text-xs text-muted-foreground">From</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 text-center">
                      <p className="text-sm font-medium">{transfer.toStore}</p>
                      <p className="text-xs text-muted-foreground">To</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-border">
                    <div>
                      <p className="text-sm font-semibold">{transfer.items}</p>
                      <p className="text-xs text-muted-foreground">Items</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">${transfer.totalValue}</p>
                      <p className="text-xs text-muted-foreground">Value</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {new Date(transfer.initiatedAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Initiated</p>
                    </div>
                  </div>

                  {/* Notes */}
                  {transfer.notes && (
                    <p className="text-xs text-muted-foreground italic">
                      "{transfer.notes}"
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    {transfer.status === 'pending' && (
                      <Button size="sm" className="flex-1">
                        Mark In Transit
                      </Button>
                    )}
                    {transfer.status === 'in_transit' && (
                      <Button size="sm" className="flex-1">
                        Mark Received
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Transfer Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-primary">
                  {transfers.filter(t => t.status === 'pending').length}
                </p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
              <div>
                <p className="text-lg font-bold text-primary">
                  {transfers.filter(t => t.status === 'in_transit').length}
                </p>
                <p className="text-xs text-muted-foreground">In Transit</p>
              </div>
              <div>
                <p className="text-lg font-bold text-primary">
                  {transfers.filter(t => t.status === 'received').length}
                </p>
                <p className="text-xs text-muted-foreground">Received</p>
              </div>
              <div>
                <p className="text-lg font-bold text-primary">
                  ${transfers.reduce((sum, t) => sum + t.totalValue, 0).toFixed(0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <NewTransferDialog />
      </div>
    </MobileLayout>
  );
};

export default Warehouse;