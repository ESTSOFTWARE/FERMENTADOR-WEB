interface Props { rating: number }

export const StarRating = ({ rating }: Props) => (
  <div style={{ display: 'flex', gap: 2 }}>
    {[1, 2, 3, 4, 5].map(star => (
      <svg key={star} width="14" height="14" viewBox="0 0 24 24" fill={star <= Math.round(rating) ? '#F59E0B' : 'none'}
        stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
    <span style={{ color: '#71717A', fontSize: 12, marginLeft: 4 }}>{rating.toFixed(1)}</span>
  </div>
)
