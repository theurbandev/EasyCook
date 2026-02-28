import Anthropic from '@anthropic-ai/sdk'
import { watchSummaryForAI } from './watches'
import type { RecommendationResult } from './types'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `You are an expert Garmin watch advisor. Your job is to recommend the best 3 Garmin watches from the provided catalog based on the user's needs.

Return ONLY valid JSON — no markdown, no explanation outside the JSON. Use this exact schema:
{
  "recommendations": [
    {
      "watchId": "<id from catalog>",
      "score": <0-100 match percentage>,
      "reasoning": "<2 concise sentences explaining why this watch fits the user>"
    }
  ],
  "summary": "<one sentence summary of the recommendations>"
}

Rules:
- Only use watchIds from the provided catalog
- Order by best match first
- Consider budget if mentioned (be realistic about price ranges)
- Be specific in reasoning — reference concrete features that match their needs
- Keep reasoning under 40 words per watch`

export async function getRecommendations(query: string): Promise<RecommendationResult> {
  const catalogJSON = JSON.stringify(watchSummaryForAI, null, 0)

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Catalog:\n${catalogJSON}\n\nUser needs: ${query}`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from AI')
  }

  let parsed: RecommendationResult
  try {
    parsed = JSON.parse(content.text)
  } catch {
    // Try to extract JSON if there's surrounding text
    const match = content.text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('AI returned invalid response format')
    parsed = JSON.parse(match[0])
  }

  if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
    throw new Error('AI response missing recommendations array')
  }

  return parsed
}
