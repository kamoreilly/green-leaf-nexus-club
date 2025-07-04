import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useInventory = () => {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          products (
            name,
            category,
            brand,
            sku,
            price
          )
        `)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useTransfers = () => {
  return useQuery({
    queryKey: ['transfers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transfers')
        .select(`
          *,
          transfer_items (
            *,
            products (name)
          )
        `)
        .order('initiated_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};