import type { PriceComparisonResult } from '../types'

interface ResultsTableProps {
  results: PriceComparisonResult[]
}

function StoreBadge({ store }: { store: PriceComparisonResult['cheaperStore'] }) {
  const styles: Record<PriceComparisonResult['cheaperStore'], string> = {
    Woolworths: 'bg-green-100 text-green-800',
    Coles: 'bg-red-100 text-red-800',
    Tie: 'bg-slate-100 text-slate-700',
    Unknown: 'bg-slate-100 text-slate-500',
  }

  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${styles[store]}`}>
      {store}
    </span>
  )
}

export function ResultsTable({ results }: ResultsTableProps) {
  if (results.length === 0) return null

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Item</th>
            <th className="px-4 py-3">Woolworths</th>
            <th className="px-4 py-3">Coles</th>
            <th className="px-4 py-3">Cheaper at</th>
            <th className="px-4 py-3">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {results.map((result, index) => (
            <tr key={`${result.item}-${index}`}>
              <td className="px-4 py-3 font-medium text-slate-800">{result.item}</td>
              <td className="px-4 py-3 text-slate-600">{result.woolworthsPrice}</td>
              <td className="px-4 py-3 text-slate-600">{result.colesPrice}</td>
              <td className="px-4 py-3">
                <StoreBadge store={result.cheaperStore} />
              </td>
              <td className="px-4 py-3 text-xs text-slate-500">{result.notes ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
