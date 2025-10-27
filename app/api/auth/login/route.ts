import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { comparePassword, generateToken } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 })
  }
}
