import { MercadoPagoConfig, Preference } from "mercadopago"

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
})

export const mercadopago = {
  preference: new Preference(client),
}
