import { GoogleGenAI, Type } from '@google/genai'
import type { Schema } from '@google/genai'
import type { PriceComparisonResult } from '../types'

const MODEL_NAME = 'gemini-2.5-flash'

const responseSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      item: {
        type: Type.STRING,
        description: 'The grocery item name as provided by the user',
      },
      woolworthsPrice: {
        type: Type.STRING,
        description: 'Current price at Woolworths in AUD, e.g. "$3.50"',
      },
      colesPrice: {
        type: Type.STRING,
        description: 'Current price at Coles in AUD, e.g. "$3.20"',
      },
      cheaperStore: {
        type: Type.STRING,
        format: 'enum',
        enum: ['Woolworths', 'Coles', 'Tie', 'Unknown'],
        description: 'Which store is cheaper for this item',
      },
      notes: {
        type: Type.STRING,
        description:
          'Optional short note, e.g. pack size, or that an item is on special at one store',
      },
    },
    required: ['item', 'woolworthsPrice', 'colesPrice', 'cheaperStore'],
  },
}

function buildResearchPrompt(items: string[]): string {
  const list = items.map((item) => `- ${item}`).join('\n')

  return `You are an Australian shopping assistant with access to Google Search. For each grocery item listed below, search the web to find the CURRENT price at Woolworths (woolworths.com.au) and at Coles (coles.com.au).

Items:
${list}

For each item:
1. Search for the item on the Woolworths website and note its current price, including whether it's on special/discounted right now.
2. Search for the item on the Coles website and note its current price, including whether it's on special/discounted right now.
3. Compare the two. Prices for the same item are often genuinely different between the two stores, especially when one store has it on special — do not assume they are equal unless your search results actually show the same price.

Report your findings item by item, citing the price you found at each store and whether it was a special/catalogue price.`
}

function buildStructuringPrompt(items: string[], research: string): string {
  const list = items.map((item) => `- ${item}`).join('\n')

  return `Convert the shopping research below into structured data for these items:
${list}

Research findings:
${research}

For each item, return:
- "item": the item name
- "woolworthsPrice": the Woolworths price found in the research (include the "$" sign)
- "colesPrice": the Coles price found in the research (include the "$" sign)
- "cheaperStore": which store is cheaper ("Woolworths", "Coles", "Tie" if equal, or "Unknown" if the research didn't find a price)
- "notes": a brief note, e.g. if a price was a special/catalogue price

Use the prices from the research as given — do not invent or round them.`
}

export async function compareGroceryPrices(
  apiKey: string,
  items: string[],
): Promise<PriceComparisonResult[]> {
  const ai = new GoogleGenAI({ apiKey })

  const researchResponse = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: buildResearchPrompt(items),
    config: {
      tools: [{ googleSearch: {} }],
    },
  })
  const research = researchResponse.text
  if (!research) {
    throw new Error('Gemini returned no research results for these items.')
  }

  const structuredResponse = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: buildStructuringPrompt(items, research),
    config: {
      responseMimeType: 'application/json',
      responseSchema,
    },
  })
  const text = structuredResponse.text
  if (!text) {
    throw new Error('Gemini returned an empty response.')
  }

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
