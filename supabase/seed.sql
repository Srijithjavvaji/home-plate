-- ==============================================================================
-- HOME PLATE - Seed & Development Sample Data
-- “Fresh Homemade Food, Delivered to Your Doorstep”
-- ==============================================================================

-- 1. INSERT CATEGORIES
insert into public.categories (id, name, slug, description, image_url, icon) values
  ('c1111111-1111-1111-1111-111111111111', 'Breakfast', 'breakfast', 'Fresh morning tiffins, dosas, idlis, and traditional morning favorites', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80', 'Coffee'),
  ('c2222222-2222-2222-2222-222222222222', 'Homestyle Meals', 'meals', 'Nutritious homestyle thalis, wholesome curries, dal, and fresh rotis', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80', 'Utensils'),
  ('c3333333-3333-3333-3333-333333333333', 'Pickles & Podis', 'pickles-podis', 'Handcrafted traditional grandmother recipes preserved with pure cold-pressed oils', 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80', 'Jar'),
  ('c4444444-4444-4444-4444-444444444444', 'Sweets & Desserts', 'sweets-desserts', 'Pure ghee laddoos, halwas, payasam, and festive regional confectioneries', 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=600&auto=format&fit=crop&q=80', 'Cake'),
  ('c5555555-5555-5555-5555-555555555555', 'Healthy & Millet', 'healthy-millet', 'Wholesome ancient grains, diabetic-friendly millet rotis, and low-oil prep', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80', 'Salad')
on conflict (slug) do nothing;

-- 2. INSERT PROFILES FOR SELLERS & ADMIN
insert into public.profiles (id, email, full_name, phone, role, avatar_url) values
  ('a0000000-0000-0000-0000-000000000001', 'admin@homeplate.app', 'Home Plate Admin', '+91 98765 00001', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'),
  ('s0000000-0000-0000-0000-000000000001', 'lakshmi@ammamma.com', 'Lakshmi Devi', '+91 98765 11001', 'seller', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80'),
  ('s0000000-0000-0000-0000-000000000002', 'shanti@shantikitchen.com', 'Shanti Narayan', '+91 98765 11002', 'seller', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'),
  ('s0000000-0000-0000-0000-000000000003', 'venkatesh@dakshin.com', 'Chef Venkatesh Iyer', '+91 98765 11003', 'seller', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'),
  ('u0000000-0000-0000-0000-000000000001', 'customer@homeplate.app', 'Rahul Sharma', '+91 98765 22001', 'customer', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80')
on conflict (id) do nothing;

-- 3. INSERT SELLERS
insert into public.sellers (id, user_id, kitchen_name, description, address, city, state, pincode, phone, latitude, longitude, fssai_number, rating, total_ratings, status, is_verified, banner_url, logo_url) values
  (
    '11111111-aaaa-1111-aaaa-111111111111',
    's0000000-0000-0000-0000-000000000001',
    'Ammamma''s Kitchen',
    'Authentic Andhra & Telangana heritage recipes cooked slowly with love, pure hand-pounded spices, and wood-pressed gingelly oil.',
    'Flat 302, Green Meadows, Madhapur',
    'Hyderabad',
    'Telangana',
    '500081',
    '+91 98765 11001',
    17.4483,
    78.3915,
    '23621001000452',
    4.9,
    184,
    'approved',
    true,
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80'
  ),
  (
    '22222222-bbbb-2222-bbbb-222222222222',
    's0000000-0000-0000-0000-000000000002',
    'Shanti''s Homestyle Flavors',
    'Wholesome North Indian home cooking, fluffy phulkas, slow-cooked Rajma, and comforting khichdis prepared fresh per order.',
    'Villa 12, Palm Springs, Jubilee Hills',
    'Hyderabad',
    'Telangana',
    '500033',
    '+91 98765 11002',
    17.4319,
    78.4073,
    '23621001000891',
    4.8,
    128,
    'approved',
    true,
    'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
  ),
  (
    '33333333-cccc-3333-cccc-333333333333',
    's0000000-0000-0000-0000-000000000003',
    'Dakshin Heritage Foods',
    'Specializing in handcrafted Andhra Avakaya pickles, spiced Podis, freshly fermented batters, and ghee roast delicacies.',
    'Plot 45, Srinagar Colony, Banjara Hills',
    'Hyderabad',
    'Telangana',
    '500034',
    '+91 98765 11003',
    17.4156,
    78.4350,
    '23621001000129',
    4.95,
    210,
    'approved',
    true,
    'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
  )
on conflict (id) do nothing;

-- 4. INSERT 10 SAMPLE HOMEMADE FOODS
insert into public.foods (
  id, seller_id, category_id, name, slug, description, price, original_price,
  is_veg, is_available, prep_time_minutes, ingredients, allergens, serving_info,
  rating, total_reviews, is_featured, image_url
) values
  (
    'f0000001-0000-0000-0000-000000000001',
    '11111111-aaaa-1111-aaaa-111111111111',
    'c1111111-1111-1111-1111-111111111111',
    'Steamed Podi Thatte Idli with Coconut Chutney',
    'steamed-podi-thatte-idli',
    'Soft, pillowy Karnataka-style plate idlis doused in aromatic gunpowder ghee podi, served with fresh ground coconut coriander chutney and piping hot vegetable sambar.',
    149.00,
    180.00,
    true,
    true,
    25,
    ARRAY['Rice', 'Urad Dal', 'Homemade Ghee', 'Bengal Gram Podi', 'Curry Leaves', 'Mustard Seeds'],
    ARRAY['Dairy'],
    '2 Large Plate Idlis (Serves 1)',
    4.9,
    42,
    true,
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80'
  ),
  (
    'f0000002-0000-0000-0000-000000000002',
    '11111111-aaaa-1111-aaaa-111111111111',
    'c2222222-2222-2222-2222-222222222222',
    'Hyderabadi Claypot Veg Dum Biryani',
    'hyderabadi-claypot-veg-dum-biryani',
    'Slow-cooked long-grain basmati rice layered with garden fresh vegetables, saffron milk, mint, and secret garam masala sealed in a natural earthen clay pot.',
    280.00,
    340.00,
    true,
    true,
    45,
    ARRAY['Aged Basmati Rice', 'Paneer', 'Carrots', 'Beans', 'Green Peas', 'Saffron', 'Pure Ghee', 'Cardamom', 'Mint'],
    ARRAY['Dairy'],
    'Clay Pot (Serves 1-2, 650g)',
    4.8,
    89,
    true,
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80'
  ),
  (
    'f0000003-0000-0000-0000-000000000003',
    '22222222-bbbb-2222-bbbb-222222222222',
    'c2222222-2222-2222-2222-222222222222',
    'Punjabi Homestyle Rajma Chawal Thali',
    'punjabi-homestyle-rajma-chawal-thali',
    'Melt-in-mouth Jammu rajma simmered in an aromatic tomato-ginger-onion gravy overnight, served alongside steamed jeera rice, 2 hot phulkas, sirka pyaz, and boondi raita.',
    220.00,
    260.00,
    true,
    true,
    30,
    ARRAY['Jammu Red Kidney Beans', 'Jeera Rice', 'Whole Wheat Atta', 'Fresh Tomatoes', 'Ginger Garlic Paste', 'Kasuri Methi'],
    ARRAY['Dairy', 'Gluten'],
    'Complete Thali (Serves 1)',
    4.9,
    64,
    true,
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80'
  ),
  (
    'f0000004-0000-0000-0000-000000000004',
    '33333333-cccc-3333-cccc-333333333333',
    'c3333333-3333-3333-3333-333333333333',
    'Grandmother''s Andhra Avakaya Mango Pickle',
    'andhra-avakaya-mango-pickle',
    'Authentic sun-cured raw mango pickle made with Guntur red chillies, mustard powder, rock salt, and cold-pressed sesame oil. Aged for 30 days without preservatives.',
    199.00,
    250.00,
    true,
    true,
    10,
    ARRAY['Raw Mango', 'Guntur Chilli Powder', 'Mustard Seed Powder', 'Cold-Pressed Gingelly Oil', 'Rock Salt', 'Garlic', 'Fenugreek'],
    ARRAY[]::text[],
    'Glass Jar 350g',
    5.0,
    115,
    true,
    'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80'
  ),
  (
    'f0000005-0000-0000-0000-000000000005',
    '33333333-cccc-3333-cccc-333333333333',
    'c3333333-3333-3333-3333-333333333333',
    'Roasted Kandi Podi (Lentil Spice Mix)',
    'roasted-kandi-podi',
    'Golden-roasted toor dal, roasted gram, and red chillies hand-pounded with cumin and asafoetida. Best enjoyed mixed into steaming hot rice with a dollop of pure homemade ghee.',
    160.00,
    200.00,
    true,
    true,
    5,
    ARRAY['Toor Dal', 'Chana Dal', 'Dry Red Chillies', 'Cumin Seeds', 'Asafoetida (Hing)', 'Curry Leaves'],
    ARRAY[]::text[],
    '250g Pouch',
    4.8,
    38,
    false,
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80'
  ),
  (
    'f0000006-0000-0000-0000-000000000006',
    '11111111-aaaa-1111-aaaa-111111111111',
    'c4444444-4444-4444-4444-444444444444',
    'Ghee Roast Moong Dal Halwa',
    'ghee-roast-moong-dal-halwa',
    'Rich Rajasthani winter specialty prepared with yellow moong lentils slow-stirred in pure A2 cow ghee, saffron water, and slivered pistachios and almonds.',
    180.00,
    220.00,
    true,
    true,
    20,
    ARRAY['Yellow Moong Dal', 'A2 Cow Ghee', 'Saffron', 'Raw Sugar', 'Cardamom', 'Almonds', 'Pistachios'],
    ARRAY['Dairy', 'Nuts'],
    '200g Box (Serves 1-2)',
    4.95,
    52,
    true,
    'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=800&auto=format&fit=crop&q=80'
  ),
  (
    'f0000007-0000-0000-0000-000000000007',
    '22222222-bbbb-2222-bbbb-222222222222',
    'c5555555-5555-5555-5555-555555555555',
    'Foxtail Millet Khichdi with Roasted Flax Chutney',
    'foxtail-millet-khichdi',
    'Gut-friendly diabetic-care one pot meal cooked with low glycemic organic foxtail millet, split yellow lentils, seasonal vegetables, crushed black pepper, and fresh cumin.',
    195.00,
    240.00,
    true,
    true,
    30,
    ARRAY['Foxtail Millet (Kangni)', 'Moong Dal', 'Spinach', 'French Beans', 'Cumin', 'Black Pepper', 'Virgin Coconut Oil'],
    ARRAY[]::text[],
    '500g Container (Serves 1)',
    4.7,
    29,
    false,
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80'
  ),
  (
    'f0000008-0000-0000-0000-000000000008',
    '22222222-bbbb-2222-bbbb-222222222222',
    'c1111111-1111-1111-1111-111111111111',
    'Methi Thepla with Sweet Mango Chhundo (Pack of 5)',
    'methi-thepla-sweet-chhundo',
    'Paper-thin whole wheat flatbreads kneaded with fresh fenugreek leaves, ginger, carom seeds (ajwain), and sesame, paired with traditional sun-baked Gujarati sweet shredded mango chhundo.',
    165.00,
    199.00,
    true,
    true,
    20,
    ARRAY['Whole Wheat Flour', 'Fresh Fenugreek (Methi)', 'Ajwain', 'Turmeric', 'Sesame Seeds', 'Raw Mango Chhundo'],
    ARRAY['Gluten', 'Sesame'],
    '5 Theplas + 50g Chhundo',
    4.85,
    35,
    false,
    'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=80'
  ),
  (
    'f0000009-0000-0000-0000-000000000009',
    '11111111-aaaa-1111-aaaa-111111111111',
    'c2222222-2222-2222-2222-222222222222',
    'Homestyle Andhra Gongura Mutton Curry',
    'andhra-gongura-mutton-curry',
    'Tender slow-braised country lamb cooked with sour sorrel leaves (gongura), crushed peppercorns, shallots, and spicy country masala. A prized Rayalaseema culinary treasure.',
    380.00,
    440.00,
    false,
    true,
    50,
    ARRAY['Fresh Tender Lamb/Mutton', 'Red Gongura Leaves', 'Shallots', 'Guntur Red Chillies', 'Ginger Garlic', 'Poppy Seeds', 'Mustard Oil'],
    ARRAY[]::text[],
    '450g Container with Gravy (Serves 1-2)',
    4.95,
    77,
    true,
    'https://images.unsplash.com/photo-1545247181-516773cae754?w=800&auto=format&fit=crop&q=80'
  ),
  (
    'f0000010-0000-0000-0000-000000000010',
    '33333333-cccc-3333-cccc-333333333333',
    'c4444444-4444-4444-4444-444444444444',
    'Artisanal Coconut Milk Mysore Pak',
    'artisanal-coconut-milk-mysore-pak',
    'Contemporary twist on the classic royal sweet made with fresh organic coconut milk, roasted besan flour, and raw cane sugar that dissolves delicately on the palate.',
    175.00,
    210.00,
    true,
    true,
    15,
    ARRAY['Roasted Gram Flour (Besan)', 'Fresh Coconut Milk', 'Pure Ghee', 'Raw Cane Sugar', 'Cardamom Powder'],
    ARRAY['Dairy'],
    '250g Box (6 Pieces)',
    4.9,
    41,
    false,
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80'
  )
on conflict (id) do nothing;

-- 5. INSERT PROMO COUPONS
insert into public.coupons (id, code, description, discount_type, discount_value, min_order_amount, max_discount_amount, is_active) values
  ('b1111111-0000-0000-0000-000000000001', 'WELCOME50', 'Flat ₹50 off on your first homemade order', 'fixed', 50.00, 200.00, 50.00, true),
  ('b2222222-0000-0000-0000-000000000002', 'HOMEPLATE10', '10% discount on orders above ₹300', 'percentage', 10.00, 300.00, 100.00, true),
  ('b3333333-0000-0000-0000-000000000003', 'FREESHIP', 'Free delivery on orders above ₹400', 'fixed', 40.00, 400.00, 40.00, true)
on conflict (code) do nothing;

-- 6. INSERT SAMPLE REVIEWS
insert into public.reviews (id, user_id, food_id, rating, comment) values
  ('r0000001-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000001', 'f0000001-0000-0000-0000-000000000001', 5, 'The best Thatte Idli I have tasted since moving to Hyderabad. The podi and pure ghee aroma takes you right back home!'),
  ('r0000002-0000-0000-0000-000000000002', 'u0000000-0000-0000-0000-000000000001', 'f0000004-0000-0000-0000-000000000004', 5, 'Real homemade taste without any chemical preservatives or artificial colors. Truly grandmother quality avakaya!'),
  ('r0000003-0000-0000-0000-000000000003', 'u0000000-0000-0000-0000-000000000001', 'f0000003-0000-0000-0000-000000000003', 5, 'Rajma was so tender and homestyle, not heavy like restaurant gravies. Phulkas were hot and soft!')
on conflict (id) do nothing;

-- 7. INSERT SAMPLE ADDRESSES
insert into public.addresses (id, user_id, label, address_line1, address_line2, city, state, pincode, phone, latitude, longitude, is_default) values
  (
    'ad111111-0000-0000-0000-000000000001',
    'u0000000-0000-0000-0000-000000000001',
    'Home',
    'Flat 401, Sapphire Heights, Hitec City',
    'Near Cyber Towers',
    'Hyderabad',
    'Telangana',
    '500081',
    '+91 98765 22001',
    17.4435,
    78.3772,
    true
  )
on conflict (id) do nothing;

-- 8. INSERT SAMPLE ORDERS & DELIVERIES
insert into public.orders (
  id, order_number, customer_id, seller_id, address_id, delivery_address,
  status, subtotal, delivery_fee, discount_amount, total_amount, payment_method, payment_status,
  razorpay_order_id, razorpay_payment_id, created_at
) values (
  'o1111111-0000-0000-0000-000000000001',
  'HP-20260930-101',
  'u0000000-0000-0000-0000-000000000001',
  '11111111-aaaa-1111-aaaa-111111111111',
  'ad111111-0000-0000-0000-000000000001',
  '{"name": "Rahul Sharma", "phone": "+91 98765 22001", "address_line1": "Flat 401, Sapphire Heights, Hitec City", "city": "Hyderabad", "state": "Telangana", "pincode": "500081", "latitude": 17.4435, "longitude": 78.3772}'::jsonb,
  'ready_for_pickup',
  429.00,
  40.00,
  50.00,
  419.00,
  'razorpay',
  'paid',
  'order_mock_1727710000',
  'pay_mock_982348',
  now()
) on conflict (order_number) do nothing;

insert into public.deliveries (
  id, order_id, provider, tracking_id, status,
  rider_name, rider_phone, rider_lat, rider_lng,
  pickup_address, pickup_pincode, pickup_lat, pickup_lng,
  drop_address, drop_pincode, drop_lat, drop_lng,
  status_history, tracking_url
) values (
  'd1111111-0000-0000-0000-000000000001',
  'o1111111-0000-0000-0000-000000000001',
  'shadowfax',
  'SFX-HP-20260930-101',
  'requested',
  null,
  null,
  null,
  null,
  'Flat 302, Green Meadows, Madhapur, Hyderabad 500081',
  '500081',
  17.4483,
  78.3915,
  'Flat 401, Sapphire Heights, Hitec City, Hyderabad 500081',
  '500081',
  17.4435,
  78.3772,
  '[{"status": "requested", "timestamp": "2026-09-30T21:35:00Z", "description": "Delivery request created and awaiting Shadowfax rider assignment."}]'::jsonb,
  'https://shadowfax.in/track?order_id=HP-20260930-101'
) on conflict (order_id) do nothing;
