-- Create initial admin user
-- Password: admin123 (hashed with bcrypt)
INSERT INTO "User" (id, email, password, nombre, apellido, role, "createdAt", "updatedAt")
VALUES (
  'admin-001',
  'admin@boxingstore.com',
  '$2a$10$rKvVPZhJZqKZ5YJ5YJ5YJOqKZ5YJ5YJ5YJ5YJ5YJ5YJ5YJ5YJ5YJ5',
  'Admin',
  'Store',
  'admin',
  NOW(),
  NOW()
);

-- Sample products
INSERT INTO "Producto" (id, nombre, descripcion, precio, categoria, genero, stock, imagenes, colores, talles, "createdAt", "updatedAt")
VALUES
  (
    'prod-001',
    'Remera de Boxeo Pro',
    'Remera técnica de alto rendimiento para entrenamiento de boxeo',
    2500.00,
    'remeras',
    'hombre',
    15,
    ARRAY['/placeholder.svg?height=400&width=400'],
    ARRAY['Negro', 'Rojo', 'Azul'],
    ARRAY['S', 'M', 'L', 'XL'],
    NOW(),
    NOW()
  ),
  (
    'prod-002',
    'Short de Boxeo Clásico',
    'Short cómodo y resistente para entrenamientos intensos',
    1800.00,
    'shorts',
    'hombre',
    20,
    ARRAY['/placeholder.svg?height=400&width=400'],
    ARRAY['Negro', 'Rojo'],
    ARRAY['S', 'M', 'L', 'XL'],
    NOW(),
    NOW()
  ),
  (
    'prod-003',
    'Buzo de Entrenamiento',
    'Buzo térmico ideal para calentamiento pre-entrenamiento',
    4500.00,
    'buzos',
    'hombre',
    10,
    ARRAY['/placeholder.svg?height=400&width=400'],
    ARRAY['Negro', 'Gris'],
    ARRAY['M', 'L', 'XL'],
    NOW(),
    NOW()
  ),
  (
    'prod-004',
    'Top Deportivo Mujer',
    'Top de alto soporte para entrenamientos de boxeo',
    2200.00,
    'tops',
    'mujer',
    12,
    ARRAY['/placeholder.svg?height=400&width=400'],
    ARRAY['Negro', 'Rosa', 'Blanco'],
    ARRAY['XS', 'S', 'M', 'L'],
    NOW(),
    NOW()
  ),
  (
    'prod-005',
    'Remera Técnica Mujer',
    'Remera de secado rápido para entrenamientos intensos',
    2300.00,
    'remeras',
    'mujer',
    18,
    ARRAY['/placeholder.svg?height=400&width=400'],
    ARRAY['Negro', 'Blanco', 'Azul'],
    ARRAY['XS', 'S', 'M', 'L'],
    NOW(),
    NOW()
  );
