import { useState } from 'react'

interface ApiKeyInputProps {
  apiKey: string
  onChange: (apiKey: string) => void
}

export function ApiKeyInput({ apiKey, onChange }: ApiKeyInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <label htmlFor="gemini-api-key" className="block text-sm font-medium text-slate-700">
        Gemini API key
      </label>
      <p className="mt-1 text-xs text-slate-500">
        Stored only in your browser&apos;s local storage. Get a key from{' '}
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noreferrer"
          className="text-emerald-600 underline hover:text-emerald-700"
        >
          Google AI Studio
        </a>
        .
      </p>
      <div className="mt-2 flex gap-2">
        <input
          id="gemini-api-key"
          type={visible ? 'text' : 'password'}
          value={apiKey}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your Gemini API key"
          autoComplete="off"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
  )
}
