"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { Header } from "@/components/header"
import { Container, Typography, Grid, CircularProgress, Box } from "@mui/material"

interface Producto {
  id: string
  nombre: string
  descripcion: string
  precio: number
  categoria: string
  genero: string
  imagenPortada: string | null
  imagenes: string[]
  variantes: Array<{
    id: string
    color: string
    talle: string
    stock: number
  }>
}

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [productos, setProductos] = useState<Producto[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setProductos([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/productos/search?q=${encodeURIComponent(query)}&limit=100`)
        const data = await response.json()
        setProductos(data.productos || [])
      } catch (error) {
        console.error("Error fetching search results:", error)
        setProductos([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [query])

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 1 }}>
        Resultados de búsqueda
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {query && (
          <>
            Mostrando {productos.length} resultado{productos.length !== 1 ? "s" : ""} para{" "}
            <strong>&quot;{query}&quot;</strong>
          </>
        )}
      </Typography>

      {productos.length > 0 ? (
        <Grid container spacing={3}>
          {productos.map((producto) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={producto.id}>
              <ProductCard producto={producto} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron productos para &quot;{query}&quot;
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Intenta con otros términos de búsqueda
          </Typography>
        </Box>
      )}
    </Container>
  )
}

export default function BuscarPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Suspense
        fallback={
          <Container maxWidth="lg" sx={{ py: 8 }}>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
              <CircularProgress />
            </Box>
          </Container>
        }
      >
        <SearchResults />
      </Suspense>
    </div>
  )
}
