-- Add missing RLS policies for user operations
CREATE POLICY "Users can insert their own profile" ON public.profiles 
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create trigger to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'full_name', 
    NEW.email,
    'member'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add RLS policies for other tables that users need to interact with
CREATE POLICY "Users can insert sales" ON public.sales 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update sales" ON public.sales 
FOR UPDATE USING (true);

CREATE POLICY "Users can insert sale items" ON public.sale_items 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can insert products" ON public.products 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update products" ON public.products 
FOR UPDATE USING (true);

CREATE POLICY "Users can insert inventory" ON public.inventory 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update inventory" ON public.inventory 
FOR UPDATE USING (true);