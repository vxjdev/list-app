import { useState } from 'react'
import type { FormEvent } from 'react'

interface GroceryListProps {
  items: string[]
  onChange: (items: string[]) => void
}

export function GroceryList({ items, onChange }: GroceryListProps) {
  const [draft, setDraft] = useState('')

  function addItem(e: FormEvent) {
    e.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed) return
    onChange([...items, trimmed])
    setDraft('')
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-medium text-slate-700">Grocery items</h2>

      <form onSubmit={addItem} className="mt-2 flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="e.g. 2L full cream milk"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <button
          type="submit"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Add
        </button>
      </form>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">No items yet. Add some grocery items above.</p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100">
          {items.map((item, index) => (
            <li key={`${item}-${index}`} className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-700">{item}</span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-xs font-medium text-red-500 hover:text-red-700"
                aria-label={`Remove ${item}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
