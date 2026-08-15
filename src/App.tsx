import { useEffect, useState } from 'react'
import { ApiKeyInput } from './components/ApiKeyInput'
import { GroceryList } from './components/GroceryList'
import { ResultsTable } from './components/ResultsTable'
import { compareGroceryPrices } from './lib/gemini'
import type { PriceComparisonResult } from './types'

const API_KEY_STORAGE_KEY = 'gemini-api-key'

function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE_KEY) ?? '')
  const [items, setItems] = useState<string[]>([])
  const [results, setResults] = useState<PriceComparisonResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey)
  }, [apiKey])

  async function handleCompare() {
    setError(null)

    if (!apiKey.trim()) {
      setError('Please enter your Gemini API key.')
      return
    }
    if (items.length === 0) {
      setError('Add at least one grocery item.')
      return
    }

    setLoading(true)
    setResults([])
    try {
      const comparison = await compareGroceryPrices(apiKey.trim(), items)
      setResults(comparison)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Grocery Price Comparison</h1>
          <p className="mt-1 text-sm text-slate-500">
            Compare Woolworths vs Coles prices for your shopping list using Gemini.
          </p>
        </header>

        <div className="space-y-4">
          <ApiKeyInput apiKey={apiKey} onChange={setApiKey} />
          <GroceryList items={items} onChange={setItems} />

          <button
            type="button"
            onClick={handleCompare}
            disabled={loading}
            className="w-full rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Comparing prices…' : 'Compare prices'}
          </button>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <ResultsTable results={results} />
        </div>
      </div>
    </div>
  )
}

export default App
