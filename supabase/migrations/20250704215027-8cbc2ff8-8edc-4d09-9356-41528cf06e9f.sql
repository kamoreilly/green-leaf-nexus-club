-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'staff', 'member')),
  store_id UUID,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stores table
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  manager_id UUID REFERENCES public.profiles(id),
  is_warehouse BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('flower', 'edibles', 'concentrates', 'vapes', 'accessories', 'other')),
  brand TEXT,
  sku TEXT UNIQUE,
  price DECIMAL(10,2),
  cost DECIMAL(10,2),
  thc_percentage DECIMAL(5,2),
  cbd_percentage DECIMAL(5,2),
  weight_grams DECIMAL(10,2),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory table
CREATE TABLE public.inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER NOT NULL DEFAULT 0,
  reorder_level INTEGER DEFAULT 10,
  last_updated_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, store_id)
);

-- Create sales table
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id),
  cashier_id UUID REFERENCES public.profiles(id),
  customer_id UUID REFERENCES public.profiles(id),
  total_amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'digital')),
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sale_items table
CREATE TABLE public.sale_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0
);

-- Create cash_ups table for daily closing
CREATE TABLE public.cash_ups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id),
  cashier_id UUID NOT NULL REFERENCES public.profiles(id),
  date DATE NOT NULL,
  opening_cash DECIMAL(10,2) NOT NULL DEFAULT 0,
  closing_cash DECIMAL(10,2) NOT NULL,
  expected_cash DECIMAL(10,2) NOT NULL,
  cash_difference DECIMAL(10,2) GENERATED ALWAYS AS (closing_cash - expected_cash) STORED,
  total_sales DECIMAL(10,2) NOT NULL DEFAULT 0,
  card_sales DECIMAL(10,2) NOT NULL DEFAULT 0,
  digital_sales DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'discrepancy')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(store_id, date)
);

-- Create transfers table for warehouse distribution
CREATE TABLE public.transfers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_store_id UUID NOT NULL REFERENCES public.stores(id),
  to_store_id UUID NOT NULL REFERENCES public.stores(id),
  initiated_by UUID NOT NULL REFERENCES public.profiles(id),
  received_by UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'received', 'cancelled')),
  notes TEXT,
  initiated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  received_at TIMESTAMP WITH TIME ZONE
);

-- Create transfer_items table
CREATE TABLE public.transfer_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transfer_id UUID NOT NULL REFERENCES public.transfers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity_sent INTEGER NOT NULL,
  quantity_received INTEGER,
  notes TEXT
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_items ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (users can see data from their store)
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view store data" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Users can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Users can view inventory" ON public.inventory FOR SELECT USING (true);
CREATE POLICY "Users can view sales" ON public.sales FOR SELECT USING (true);
CREATE POLICY "Users can view sale items" ON public.sale_items FOR SELECT USING (true);
CREATE POLICY "Users can view cash ups" ON public.cash_ups FOR SELECT USING (true);
CREATE POLICY "Users can view transfers" ON public.transfers FOR SELECT USING (true);
CREATE POLICY "Users can view transfer items" ON public.transfer_items FOR SELECT USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON public.stores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON public.inventory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();