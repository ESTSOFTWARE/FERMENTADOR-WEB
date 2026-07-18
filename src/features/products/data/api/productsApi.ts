import type { Product, ProductSpec, ProductReview } from '../../domain/models/Product'
import { apiClient }    from '../../../../core/network/client'

interface PaginatedProducts {
  items: Product[]
  total: number
  page:  number
  limit: number
}

interface SpecDto    { id: number; name: string; value: string }
interface IncludeDto { id: number; description: string }
interface ReviewDto  { id: number; user_id: number; rating: number; comment: string | null; created_at: string }
interface ReviewListDto { items: ReviewDto[]; total: number; average_rating: number }

const fmtDate = (d: string) => new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })

const toReview = (r: ReviewDto): ProductReview => ({
  id:          r.id,
  userId:      r.user_id,
  name:        `Usuario #${r.user_id}`,
  initials:    `U${r.user_id}`,
  institution: 'Cliente verificado',
  rating:      r.rating,
  date:        fmtDate(r.created_at),
  text:        r.comment ?? '',
  verified:    true,
})

export const productsApi = {
  getAll:  (): Promise<Product[]> =>
    apiClient.get<PaginatedProducts>('/products/?limit=100').then(r => r.items),

  // Detalle enriquecido: producto + ficha técnica + incluye + reseñas (best-effort).
  getById: async (id: number): Promise<Product> => {
    const product = await apiClient.get<Product>(`/products/${id}`)

    const [specs, includes, reviews] = await Promise.all([
      apiClient.get<SpecDto[]>(`/products/${id}/specifications/`).catch(() => [] as SpecDto[]),
      apiClient.get<IncludeDto[]>(`/products/${id}/includes/`).catch(() => [] as IncludeDto[]),
      apiClient.get<ReviewListDto>(`/products/${id}/reviews/`).catch(() => ({ items: [], total: 0, average_rating: 0 })),
    ])

    return {
      ...product,
      specs:       specs.map<ProductSpec>(s => ({ label: s.name, value: s.value })),
      inclusions:  includes.map(i => i.description),
      reviews:     reviews.items.map(toReview),
      reviewCount: reviews.total,
    }
  },
}
