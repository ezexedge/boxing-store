# Boxing Apparel E-commerce

Aplicación completa de e-commerce para venta de ropa de boxeo, construida con Next.js 16, Prisma, PostgreSQL (Neon) y MercadoPago.

## Características

- 🛍️ Catálogo de productos con filtros por categoría y género
- 🛒 Carrito de compras persistente
- 💳 Integración con MercadoPago Checkout Pro
- 👤 Sistema de autenticación con JWT
- 👨‍💼 Panel de administración completo
- 📊 Estadísticas y gestión de pedidos
- 📱 Diseño responsive con Material UI
- 📸 Carga de imágenes múltiples con UploadThing
- 🎨 Sistema de variantes (color + talle + stock)

## Variables de Entorno

Configura las siguientes variables de entorno en la sección **"Vars"** del sidebar de v0:

\`\`\`env
# Database (Neon PostgreSQL)
NEON_NEON_DATABASE_URL="postgresql://user:password@host/database"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this"

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN="your-mercadopago-access-token"
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY="your-mercadopago-public-key"

# UploadThing (Image Upload)
UPLOADTHING_TOKEN="your-uploadthing-token"
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APPID="your-uploadthing-app-id"
\`\`\`

## Instalación Local

1. **Instalar dependencias:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configurar la base de datos:**
   \`\`\`bash
   npm run db:generate
   npm run db:push
   \`\`\`

3. **Poblar la base de datos:**
   \`\`\`bash
   npm run db:seed
   \`\`\`

4. **Ejecutar el servidor de desarrollo:**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Abrir en el navegador:**
   \`\`\`
   http://localhost:3000
   \`\`\`

## Credenciales de Admin por Defecto

- **Email:** admin@boxingstore.com
- **Password:** admin123

⚠️ **Importante:** Cambia estas credenciales después del primer login!

## Estructura del Proyecto

\`\`\`
├── app/                    # Páginas y rutas de Next.js
│   ├── api/               # API Routes
│   │   ├── uploadthing/   # UploadThing endpoints
│   │   └── admin/         # Admin API routes
│   ├── admin/             # Panel de administración
│   ├── producto/          # Páginas de productos
│   └── checkout/          # Proceso de pago
├── components/            # Componentes React
├── lib/                   # Utilidades y contextos
├── prisma/               # Schema y seed de Prisma
└── scripts/              # Scripts SQL
\`\`\`

## Sistema de Variantes

Cada producto puede tener múltiples variantes con:
- **Color:** Negro, Rojo, Azul, etc.
- **Talle:** S, M, L, XL, etc.
- **Stock:** Cantidad disponible por variante

Esto permite un control granular del inventario por cada combinación de color y talle.

## Tecnologías

- **Framework:** Next.js 16 (App Router)
- **Base de datos:** PostgreSQL (Neon) + Prisma ORM
- **Autenticación:** JWT + bcryptjs
- **Pagos:** MercadoPago Checkout Pro
- **Imágenes:** UploadThing
- **UI:** Material UI + Tailwind CSS
- **TypeScript:** Tipado completo
