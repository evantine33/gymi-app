const Anthropic = require('@anthropic-ai/sdk')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) }
  }

  const { imageBase64, mediaType } = body
  if (!imageBase64 || !mediaType) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing imageBase64 or mediaType' }) }
  }

  try {
    const client = new Anthropic({ apiKey })

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: imageBase64 },
            },
            {
              type: 'text',
              text: `Analyze this food image and estimate the nutritional content.
Return ONLY a valid JSON object — no markdown, no explanation — with exactly these fields:
{
  "foodName": "brief name of the meal/food",
  "items": ["list", "of", "individual", "items", "visible"],
  "calories": 0,
  "protein": 0,
  "carbs": 0,
  "fat": 0,
  "fiber": 0
}
All numeric values are per the estimated full portion shown. Protein, carbs, fat, fiber are in grams.
If no food is visible, return: {"error": "No food detected in image"}`,
            },
          ],
        },
      ],
    })

    const raw = message.content[0].text.trim()
    // Strip any accidental markdown code fences
    const cleaned = raw.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim()

    // Validate it parses as JSON
    JSON.parse(cleaned)

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: cleaned,
    }
  } catch (err) {
    console.error('analyze-food error:', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to analyze image. Please try again.' }),
    }
  }
}
