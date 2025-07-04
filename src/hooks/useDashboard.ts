import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      // Get member count
      const { data: members, error: membersError } = await supabase
        .from('profiles')
        .select('id, role');
      
      if (membersError) throw membersError;

      // Get product count and low stock items
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`
          id,
          is_active,
          inventory (
            quantity,
            reorder_level
          )
        `)
        .eq('is_active', true);
      
      if (productsError) throw productsError;

      // Get recent sales
      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select('total_amount, created_at, payment_method')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (salesError) throw salesError;

      // Calculate stats
      const lowStockItems = products.filter(p => {
        const stock = p.inventory?.[0]?.quantity || 0;
        const reorderLevel = p.inventory?.[0]?.reorder_level || 10;
        return stock <= reorderLevel;
      });

      const todaySales = sales.filter(sale => {
        const saleDate = new Date(sale.created_at);
        const today = new Date();
        return saleDate.toDateString() === today.toDateString();
      });

      const dailySalesTotal = todaySales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);

      return {
        totalMembers: members.length,
        activeMembers: members.filter(m => m.role !== 'member').length,
        totalProducts: products.length,
        lowStockCount: lowStockItems.length,
        dailySales: dailySalesTotal,
        recentSales: sales.slice(0, 4)
      };
    },
  });
};