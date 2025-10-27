"use client"

import { Box } from "@mui/material"
import Link from "next/link"

export function WhatsAppButton() {
  // Configura tu número de WhatsApp aquí (formato internacional sin + ni espacios)
  const phoneNumber = "5491112345678" // Ejemplo: 549 11 1234-5678
  const message = "¡Hola! Me interesa consultar sobre los productos."
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 64,
          height: 64,
          borderRadius: "50%",
          backgroundColor: "#25D366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(37, 211, 102, 0.4)",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 1000,
          "&:hover": {
            backgroundColor: "#20BA5A",
            transform: "scale(1.1)",
            boxShadow: "0 8px 20px rgba(37, 211, 102, 0.5)",
          },
          "&:active": {
            transform: "scale(1.05)",
          },
        }}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block" }}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.2l3.18-.836A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.597 0-3.106-.47-4.365-1.277l-.313-.196-3.243.852.865-3.17-.21-.325A7.955 7.955 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"
            fill="white"
          />
          <path
            d="M16.735 13.492c-.233-.116-1.384-.682-1.598-.761-.215-.079-.372-.116-.53.116-.157.233-.608.761-.746.918-.137.157-.274.177-.508.06-.233-.116-1.002-.37-1.91-1.178-.706-.63-1.183-1.408-1.321-1.641-.137-.233-.015-.36.102-.476.105-.104.233-.274.35-.411.116-.137.155-.233.233-.39.078-.157.039-.294-.02-.411-.06-.116-.53-1.28-.726-1.751-.191-.458-.385-.396-.53-.403-.137-.007-.294-.009-.451-.009a.866.866 0 00-.628.294c-.215.233-.822.803-.822 1.958 0 1.155.842 2.271.959 2.428.116.157 1.656 2.53 4.013 3.548.561.242 1 .387 1.342.495.563.179 1.075.154 1.48.093.451-.067 1.384-.566 1.579-1.112.195-.546.195-1.014.137-1.112-.059-.098-.216-.157-.451-.274z"
            fill="white"
          />
        </svg>
      </Box>
    </Link>
  )
}
