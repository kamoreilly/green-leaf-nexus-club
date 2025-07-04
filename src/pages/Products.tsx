import { useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Package, DollarSign, AlertTriangle, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProducts } from '@/hooks/useProducts';
import { AddProductDialog } from '@/components/dialogs/AddProductDialog';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { data: products = [], isLoading } = useProducts();

  const categories = ['all', 'flower', 'edibles', 'concentrates', 'vapes', 'accessories', 'other'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'flower': return 'default';
      case 'edibles': return 'secondary';
      case 'concentrates': return 'destructive';
      case 'vapes': return 'outline';
      default: return 'outline';
    }
  };

  const getStock = (product: any) => {
    return product.inventory?.[0]?.quantity || 0;
  };

  const getReorderLevel = (product: any) => {
    return product.inventory?.[0]?.reorder_level || 10;
  };

  const isLowStock = (product: any) => {
    const stock = getStock(product);
    const reorderLevel = getReorderLevel(product);
    return stock <= reorderLevel;
  };

  if (isLoading) {
    return (
      <MobileLayout title="Products">
        <div className="p-4 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Products">
      <div className="p-4 space-y-4">
        {/* Search and Filters */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          <Button size="icon" className="shrink-0" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4" />
          </Button>
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Low Stock Alert */}
        {filteredProducts.some(p => isLowStock(p)) && (
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">
                  {filteredProducts.filter(p => isLowStock(p)).length} items low in stock
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products List */}
        <div className="space-y-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="p-4">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                    <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge variant={getCategoryColor(product.category)} className="text-xs">
                      {product.category}
                    </Badge>
                    {isLowStock(product) && (
                      <Badge variant="destructive" className="text-xs">
                        Low Stock
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="text-sm font-semibold">${product.price}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Stock</p>
                    <p className={`text-sm font-semibold ${isLowStock(product) ? 'text-destructive' : ''}`}>
                      {getStock(product)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">THC%</p>
                    <p className="text-sm font-semibold">{product.thc_percentage}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Weight</p>
                    <p className="text-sm font-semibold">{product.weight_grams}g</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Margin: ${(product.price - product.cost).toFixed(2)}
                  </span>
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Inventory Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-primary">{products.length}</p>
                <p className="text-xs text-muted-foreground">Total Products</p>
              </div>
              <div>
                <p className="text-lg font-bold text-destructive">
                  {products.filter(p => isLowStock(p)).length}
                </p>
                <p className="text-xs text-muted-foreground">Low Stock</p>
              </div>
              <div>
                <p className="text-lg font-bold text-primary">
                  {products.reduce((sum, p) => sum + getStock(p), 0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Units</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <AddProductDialog 
          open={showAddDialog} 
          onOpenChange={setShowAddDialog}
        />
      </div>
    </MobileLayout>
  );
};

export default Products;