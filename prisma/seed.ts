import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@boxingstore.com" },
    update: {},
    create: {
      email: "admin@boxingstore.com",
      password: hashedPassword,
      nombre: "Admin",
      apellido: "Sistema",
      role: "admin",
    },
  })
  console.log("✅ Admin user created:", admin.email)

  const productos = [
    {
      nombre: "Remera de Entrenamiento Pro",
      descripcion: "Remera técnica de alto rendimiento para entrenamientos intensos",
      precio: 8500,
      categoria: "remeras",
      genero: "hombre",
      imagenes: ["/black-boxing-training-shirt.jpg"],
      variantes: [
        { color: "Negro", talle: "S", stock: 5 },
        { color: "Negro", talle: "M", stock: 8 },
        { color: "Negro", talle: "L", stock: 7 },
        { color: "Negro", talle: "XL", stock: 5 },
        { color: "Rojo", talle: "M", stock: 4 },
        { color: "Rojo", talle: "L", stock: 6 },
        { color: "Azul", talle: "M", stock: 3 },
        { color: "Azul", talle: "L", stock: 4 },
      ],
    },
    {
      nombre: "Short de Boxeo Clásico",
      descripcion: "Short tradicional de boxeo con cintura elástica",
      precio: 6500,
      categoria: "shorts",
      genero: "hombre",
      imagenes: ["/black-boxing-shorts.jpg"],
      variantes: [
        { color: "Negro", talle: "S", stock: 6 },
        { color: "Negro", talle: "M", stock: 10 },
        { color: "Negro", talle: "L", stock: 8 },
        { color: "Negro", talle: "XL", stock: 6 },
        { color: "Rojo", talle: "M", stock: 5 },
        { color: "Rojo", talle: "L", stock: 7 },
      ],
    },
    {
      nombre: "Buzo con Capucha Fighter",
      descripcion: "Buzo cómodo ideal para antes y después del entrenamiento",
      precio: 12500,
      categoria: "buzos",
      genero: "hombre",
      imagenes: ["/black-boxing-hoodie.jpg"],
      variantes: [
        { color: "Negro", talle: "M", stock: 4 },
        { color: "Negro", talle: "L", stock: 6 },
        { color: "Negro", talle: "XL", stock: 5 },
        { color: "Gris", talle: "L", stock: 3 },
        { color: "Gris", talle: "XL", stock: 4 },
      ],
    },
    {
      nombre: "Top Deportivo Mujer",
      descripcion: "Top de alto soporte para entrenamientos de alta intensidad",
      precio: 7500,
      categoria: "tops",
      genero: "mujer",
      imagenes: ["/black-sports-bra.jpg"],
      variantes: [
        { color: "Negro", talle: "XS", stock: 4 },
        { color: "Negro", talle: "S", stock: 6 },
        { color: "Negro", talle: "M", stock: 5 },
        { color: "Negro", talle: "L", stock: 5 },
        { color: "Rosa", talle: "S", stock: 3 },
        { color: "Rosa", talle: "M", stock: 4 },
        { color: "Blanco", talle: "M", stock: 3 },
      ],
    },
    {
      nombre: "Remera Técnica Mujer",
      descripcion: "Remera de secado rápido con tecnología anti-olor",
      precio: 7800,
      categoria: "remeras",
      genero: "mujer",
      imagenes: ["/black-womens-training-shirt.jpg"],
      variantes: [
        { color: "Negro", talle: "XS", stock: 5 },
        { color: "Negro", talle: "S", stock: 7 },
        { color: "Negro", talle: "M", stock: 6 },
        { color: "Negro", talle: "L", stock: 4 },
        { color: "Blanco", talle: "S", stock: 4 },
        { color: "Blanco", talle: "M", stock: 5 },
        { color: "Rosa", talle: "S", stock: 3 },
        { color: "Rosa", talle: "M", stock: 4 },
      ],
    },
    {
      nombre: "Short Mujer Pro",
      descripcion: "Short de entrenamiento con bolsillos laterales",
      precio: 6800,
      categoria: "shorts",
      genero: "mujer",
      imagenes: ["/black-womens-training-shorts.jpg"],
      variantes: [
        { color: "Negro", talle: "XS", stock: 4 },
        { color: "Negro", talle: "S", stock: 6 },
        { color: "Negro", talle: "M", stock: 5 },
        { color: "Negro", talle: "L", stock: 3 },
        { color: "Gris", talle: "S", stock: 3 },
        { color: "Gris", talle: "M", stock: 4 },
      ],
    },
  ]

  for (const producto of productos) {
    const { variantes, ...productoData } = producto
    const created = await prisma.producto.create({
      data: {
        ...productoData,
        variantes: {
          create: variantes,
        },
      },
    })
    console.log("✅ Product created:", created.nombre, `with ${variantes.length} variantes`)
  }

  console.log("🎉 Seeding completed!")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
