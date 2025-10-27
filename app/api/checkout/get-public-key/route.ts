import { NextResponse } from "next/server"

export async function GET() {
  // Return the MercadoPago public key from server
  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY

  if (!publicKey) {
    return NextResponse.json({ error: "MercadoPago public key not configured" }, { status: 500 })
  }

  return NextResponse.json({ publicKey })
}
