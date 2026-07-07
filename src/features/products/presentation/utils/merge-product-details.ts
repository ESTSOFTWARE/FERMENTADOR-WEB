import type { Product, ProductReview, ProductSpec } from '../../domain/models/Product'
import type { Specification } from '../../../specifications/domain/models/Specification'
import type { Include }        from '../../../includes/domain/models/Include'
import type { ReviewPage }     from '../../../reviews/domain/models/ReviewPage'

export const mergeProductDetails = (
  product:    Product,
  specs:      Specification[],
  includes:   Include[],
  reviewPage: ReviewPage,
): Product => {
  const mappedSpecs: ProductSpec[] = specs.map(s => ({ label: s.name, value: s.value }))
  const mappedInclusions: string[] = includes.map(i => i.description)

  const mappedReviews: ProductReview[] = reviewPage.items.map(r => ({
    id:          r.id,
    name:        `Usuario #${r.user_id}`,
    initials:    'US',
    institution: '',
    rating:      r.rating,
    date:        new Date(r.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
    text:        r.comment ?? '',
    verified:    true,
  }))

  return {
    ...product,
    rating:      reviewPage.averageRating || product.rating,
    specs:       mappedSpecs.length      ? mappedSpecs      : undefined,
    inclusions:  mappedInclusions.length ? mappedInclusions : undefined,
    reviews:     mappedReviews.length    ? mappedReviews    : undefined,
    reviewCount: reviewPage.total,
  }
}