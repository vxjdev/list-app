import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'
import type { Schema } from '@google/generative-ai'
import type { PriceComparisonResult } from '../types'

const MODEL_NAME = 'gemini-2.5-flash'

const responseSchema: Schema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      item: {
        type: SchemaType.STRING,
        description: 'The grocery item name as provided by the user',
      },
      woolworthsPrice: {
        type: SchemaType.STRING,
        description: 'Estimated price at Woolworths in AUD, e.g. "$3.50"',
      },
      colesPrice: {
        type: SchemaType.STRING,
        description: 'Estimated price at Coles in AUD, e.g. "$3.20"',
      },
      cheaperStore: {
        type: SchemaType.STRING,
        format: 'enum',
        enum: ['Woolworths', 'Coles', 'Tie', 'Unknown'],
        description: 'Which store is cheaper for this item',
      },
      notes: {
        type: SchemaType.STRING,
        description: 'Optional short note, e.g. about pack size or specials',
      },
    },
    required: ['item', 'woolworthsPrice', 'colesPrice', 'cheaperStore'],
  },
}

function buildPrompt(items: string[]): string {
  const list = items.map((item) => `- ${item}`).join('\n')

  return `You are a helpful Australian shopping assistant. For each grocery item listed below, estimate the typical current price at Woolworths and at Coles (in AUD).

Items:
${list}

For each item, return:
- "item": the item name
- "woolworthsPrice": estimated Woolworths price (include the "$" sign)
- "colesPrice": estimated Coles price (include the "$" sign)
- "cheaperStore": which store is cheaper ("Woolworths", "Coles", "Tie" if equal, or "Unknown" if you cannot estimate)
- "notes": a brief note, e.g. typical pack size assumed

Return your best estimate even if you are not certain, and keep prices realistic for Australian supermarkets.`
}

export async function compareGroceryPrices(
  apiKey: string,
  items: string[],
): Promise<PriceComparisonResult[]> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema,
    },
  })

  const result = await model.generateContent(buildPrompt(items))
  const text = result.response.text()

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('Gemini returned a response that could not be parsed as JSON.')
  }

  if (!Array.isArray(parsed)) {
    throw new Error('Gemini returned an unexpected response format.')
  }

  return parsed as PriceComparisonResult[]
}
