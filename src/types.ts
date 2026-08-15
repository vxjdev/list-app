export interface PriceComparisonResult {
  item: string
  woolworthsPrice: string
  colesPrice: string
  cheaperStore: 'Woolworths' | 'Coles' | 'Tie' | 'Unknown'
  notes?: string
}
