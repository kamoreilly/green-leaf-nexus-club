-- Create a default store for the POS system
INSERT INTO public.stores (name, address, phone, email, is_warehouse)
VALUES (
  'Main Store',
  '123 Main Street, City, State 12345',
  '(555) 123-4567',
  'contact@mainstore.com',
  false
) ON CONFLICT DO NOTHING;