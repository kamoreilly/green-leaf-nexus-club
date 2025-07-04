import { useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProducts } from '@/hooks/useProducts';
import { useCreateSale } from '@/hooks/useSales';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const POS = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const { data: products = [], isLoading } = useProducts();
  const createSale = useCreateSale();
  const { toast } = useToast();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: product.price || 0,
        quantity: 1
      }]);
    }
  };

  const updateQuantity = (id: string, change: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const processSale = async (paymentMethod: string) => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to cart before processing sale",
        variant: "destructive"
      });
      return;
    }

    try {
      await createSale.mutateAsync({
        total_amount: total,
        tax_amount: tax,
        payment_method: paymentMethod,
        status: 'completed'
      });

      setCart([]);
      setShowPayment(false);
      toast({
        title: "Sale completed",
        description: `Sale processed successfully: $${total.toFixed(2)}`
      });
    } catch (error) {
      toast({
        title: "Sale failed",
        description: "Failed to process sale",
        variant: "destructive"
      });
    }
  };

  const PaymentDialog = () => (
    <Dialog open={showPayment} onOpenChange={setShowPayment}>
      <DialogContent className="w-[95vw] max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Options</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-2xl font-bold">${total.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Total Amount</p>
          </div>
          
          <div className="space-y-2">
            <Button 
              className="w-full h-12" 
              size="lg"
              onClick={() => processSale('cash')}
              disabled={createSale.isPending}
            >
              <Banknote className="h-5 w-5 mr-2" />
              Cash Payment
            </Button>
            <Button 
              className="w-full h-12" 
              variant="outline" 
              size="lg"
              onClick={() => processSale('card')}
              disabled={createSale.isPending}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Card Payment
            </Button>
            <Button 
              className="w-full h-12" 
              variant="outline" 
              size="lg"
              onClick={() => processSale('digital')}
              disabled={createSale.isPending}
            >
              <Smartphone className="h-5 w-5 mr-2" />
              Digital Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (isLoading) {
    return (
      <MobileLayout title="Point of Sale">
        <div className="p-4 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Point of Sale">
      <div className="p-4 space-y-4">
        {/* Product Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => addToCart(product)}
            >
              <CardContent className="p-3">
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary">${product.price}</span>
                    <span className="text-xs text-muted-foreground">
                      Stock: {product.inventory?.[0]?.quantity || 0}
                    </span>
                  </div>
                  {product.thc_percentage && product.thc_percentage > 0 && (
                    <p className="text-xs text-muted-foreground">THC: {product.thc_percentage}%</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cart */}
        {cart.length > 0 && (
          <Card className="sticky bottom-20 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex justify-between items-center">
                Cart ({cart.length} items)
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setCart([])}
                >
                  Clear
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Cart Items */}
              <div className="max-h-40 overflow-y-auto space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">${item.price} each</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (8%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => setShowPayment(true)}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Checkout
              </Button>
            </CardContent>
          </Card>
        )}

        <PaymentDialog />
      </div>
    </MobileLayout>
  );
};

export default POS;