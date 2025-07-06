import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSales = () => {
  return useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          sale_items (
            *,
            products (name, price)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (saleData: any) => {
      // Get the first store to use as the default store
      const { data: stores } = await supabase
        .from('stores')
        .select('id')
        .limit(1)
        .single();
      
      if (!stores) {
        throw new Error('No store found');
      }
      
      const saleWithStore = {
        ...saleData,
        store_id: stores.id
      };
      
      const { data, error } = await supabase
        .from('sales')
        .insert(saleWithStore)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};