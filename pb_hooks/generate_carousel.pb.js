/// <reference path="../pb_data/types.d.ts" />
 
/**
 * Generate Carousel Hook
 *
 * Endpoint: POST /api/generate-carousel
 * Purpose: Generate carousel content using Claude API (server-side)
 *
 * Request body:
 * {
 *   "input_text": "content to transform",
 *   "style": "hormozi|welsh|koe|custom",
 *   "custom_instructions": "optional tweaks",
 *   "user_voice_samples": "optional user posts for custom style"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "content": {
 *     "slides": [...],
 *     "caption": "...",
 *     "pinned_comment": "...",
 *     "hooks": [...]
 *   }
 * }
 */

routerAdd("POST", "/api/generate-carousel", (c) => {
  
/**
 * Parse carousel content from Claude's response
 */
function parseCarouselContent(responseText) {
  try {
    // Try to extract JSON from response (in case there's extra text)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('[generate-carousel] No valid JSON found in response')
      return null
    }

    let jsonText = responseText.trim();

    // Remove markdown code blocks if present
    if (jsonText.startsWith("```json")) {
        jsonText = jsonText.replace(/```json\n?/, "").replace(/\n?```$/, "");
    } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/```\n?/, "").replace(/\n?```$/, "");
    }

    // Parse the JSON
    const parsed = JSON.parse(jsonText);


    //const parsed = JSON.parse(jsonMatch[0])
    console.log("parsed:", parsed)

    // Validate structure
    if (!parsed.slides || !Array.isArray(parsed.slides)) {
      console.error('[generate-carousel] Invalid response: missing slides array')
      return null
    }

    if (!parsed.caption || typeof parsed.caption !== 'string') {
      console.error('[generate-carousel] Invalid response: missing caption')
      return null
    }

    if (!parsed.pinned_comment || typeof parsed.pinned_comment !== 'string') {
      console.error('[generate-carousel] Invalid response: missing pinned_comment')
      return null
    }

    if (!parsed.hooks || !Array.isArray(parsed.hooks)) {
      console.error('[generate-carousel] Invalid response: missing hooks array')
      return null
    }

    // Validate slides
    for (let i = 0; i < parsed.slides.length; i++) {
      const slide = parsed.slides[i]
      if (
        typeof slide.slide_number !== 'number' ||
        typeof slide.title !== 'string' ||
        typeof slide.content !== 'string'
      ) {
        console.error(`[generate-carousel] Invalid slide structure at index ${i}`)
        return null
      }
    }

    return parsed
  } catch (error) {
    console.error('[generate-carousel] Failed to parse response:', error)
    return null
  }
}
  try {
    // Get request body
    const body = new DynamicModel({
      "input_text": "",
      "style": "",
      "user_voice_samples": ""
    });

    c.bind(body);
    const { input_text, style, user_voice_samples} = body;

    //const data = c.request.json() || {}
    //const { input_text, style, custom_instructions, user_voice_samples } = data

    // Validate required fields
    if (!input_text || !style) {
      return c.json(400, {
        success: false,
        error: 'input_text and style are required',
      })
    }

    // Validate style
    const validStyles = ['hormozi', 'welsh', 'koe', 'custom']
    if (!validStyles.includes(style)) {
      return c.json(400, {
        success: false,
        error: 'Invalid style. Must be one of: hormozi, welsh, koe, custom',
      })
    }

    // Get API key from environment
    // const apiKey = process.env.ANTHROPIC_API_KEY
    // if (!apiKey) {
    //   console.error('[generate-carousel] ANTHROPIC_API_KEY not configured')
    //   return c.json(500, {
    //     success: false,
    //     error: 'AI service is not configured. Please contact support.',
    //   })
    // }

    // Build system prompt based on style
    //const systemPrompt = getSystemPrompt(style, user_voice_samples)
    let userVoiceSamples = user_voice_samples;

    const basePrompt = `You are an expert LinkedIn content creator specializing in high-converting carousel posts. Your task is to transform any content into a compelling 10-14 slide carousel that maximizes engagement.

# Output Format
You MUST respond with valid JSON in this exact structure:
{
  "slides": [
    {
      "slide_number": 1,
      "title": "Hook Title",
      "content": "Main content text for this slide",
      "notes": "Design suggestion or formatting note (optional)"
    },
    // ... more slides (10-14 total)
  ],
  "caption": "Full LinkedIn caption with line breaks and emojis",
  "pinned_comment": "Engaging pinned comment to boost engagement",
  "hooks": ["Alternative hook 1", "Alternative hook 2", "Alternative hook 3"]
}

# Carousel Structure
- Slide 1: HOOK - Grab attention with a bold statement, question, or surprising fact
- Slides 2-3: Problem/Context - Establish the pain point or situation
- Slides 4-10: Value/Content - Core insights, steps, or strategies
- Slide 11-12: Proof/Example - Case study, stats, or story
- Slide 13: CTA - Clear call-to-action (DM, comment, follow)
- Slide 14: Outro - Personal sign-off or brand reminder

# Writing Guidelines
- Keep each slide to 40-60 words MAX
- Use simple, punchy language
- Include specific numbers and examples
- Create scroll-stopping hooks
- End with clear next steps
- Use emojis sparingly in caption only

`

  const stylePrompts = {
    hormozi: `# Alex Hormozi Style
- Direct, no-fluff communication
- Lead with bold value propositions
- Use concrete numbers and proof ("$100M offers", "127 businesses")
- Frame everything as cause-effect relationships
- Include specific tactical steps
- End with strong, actionable CTAs
- Example phrases: "Here's what nobody tells you...", "The only 3 things that matter...", "If you do X, you'll get Y"
`,

    welsh: `# Justin Welsh Style
- Calm, conversational, helpful tone
- Share personal experience and lessons learned
- Break down complex ideas simply
- Use storytelling to illustrate points
- Focus on helping others grow
- Authentic and relatable
- Example phrases: "Here's what I learned...", "The simple truth is...", "This changed everything for me..."
`,

    koe: `# Dan Koe Style
- Deep, philosophical, thought-provoking
- Explore mindset and personal transformation
- Use metaphors and analogies
- Question conventional wisdom
- Focus on self-actualization and purpose
- Poetic but practical
- Example phrases: "Most people don't realize...", "The paradox is...", "Your mind is the ultimate..."
`,

    custom: userVoiceSamples
      ? `# Custom Voice (Trained on User's Posts)
Use the following writing samples to match the user's unique voice, tone, and style:

${userVoiceSamples}

Analyze these samples and replicate:
- Sentence structure and length
- Vocabulary and word choice
- Tone (formal/casual, serious/playful)
- Use of emojis, punctuation, formatting
- Common phrases or patterns
- Topics and themes
`
      : `# Custom Voice (Default)
- Professional yet approachable
- Clear and concise
- Action-oriented
- Data-driven when possible
- Engaging and conversational
`,
  }

  const systemPrompt = basePrompt + stylePrompts[style]


    // Build user prompt
    let userPrompt = `Transform the following content into a high-converting LinkedIn carousel:\n\n${input_text}`
    // if (custom_instructions) {
    //   userPrompt += `\n\nAdditional Instructions:\n${custom_instructions}`
    // }
    userPrompt += `\n\nRemember: Respond ONLY with valid JSON in the exact format specified. No additional text before or after the JSON.`

    // Call Claude API
    console.log('[generate-carousel] Calling Claude API...')
    // Make synchronous HTTP request using PocketBase $http
    const response = $http.send({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        method: "POST",
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: systemPrompt + "\n" + userPrompt
                }]
            }],
            generationConfig: {
                temperature: 0.8,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        }),
        headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": 'AIzaSyAusy916DV-DpAI2kGc2J5sIy0Mo7x0gSI'
        },
        timeout: 30 // 30 second timeout
    });
    // const response = fetch('https://api.anthropic.com/v1/messages', {
    //   method: 'POST',
    //   headers: {
    //     'x-api-key': apiKey,
    //     'anthropic-version': '2023-06-01',
    //     'content-type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     model: process.env.AI_MODEL || 'claude-3-5-sonnet-20241022',
    //     max_tokens: parseInt(process.env.AI_MAX_TOKENS || '4000'),
    //     temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
    //     system: systemPrompt,
    //     messages: [
    //       {
    //         role: 'user',
    //         content: userPrompt,
    //       },
    //     ],
    //   }),
    // })

    // Check response status
    if (response.statusCode !== 200) {
      const errorData = response.raw
      console.error('[generate-carousel] Claude API error:', response.status, errorData)

      if (response.status === 401) {
        return c.json(500, {
          success: false,
          error: 'AI service authentication failed. Please contact support.',
        })
      }

      if (response.status === 429) {
        return c.json(429, {
          success: false,
          error: 'AI service is busy. Please try again in a few moments.',
        })
      }

      return c.json(500, {
        success: false,
        error: 'Failed to generate content. Please try again.',
      })
    }

    // Parse response
    const claudeResponse = JSON.parse(response.raw)
    console.log('[generate-carousel] Claude API response received')
    //console.log("claudeResponse:", toString(claudeResponse))
    //console.log("response.raw:", response.raw)

    // Extract text content
    const generatedText = claudeResponse.candidates?.[0]?.content?.parts?.[0]?.text || "";
    // const responseText = toString(claudeResponse.content)
    //   .filter((block) => block.type === 'text')
    //   .map((block) => block.text)
    //   .join('\n')

    console.log('[generate-carousel] Generated text length:', generatedText);
    // Parse JSON from response
    const content = parseCarouselContent(generatedText)

    if (!content) {
      return c.json(500, {
        success: false,
        error: 'Failed to parse AI response. Please try again.',
      })
    }

    // Return success response
    return c.json(200, {
      success: true,
      content: content,
    })
  } catch (err) {
    console.error('[generate-carousel] Error:', err)
    return c.json(500, {
      success: false,
      error: 'Internal server error. Please try again.',
    })
  }

})

/**
 * Get system prompt based on writing style
 */
function getSystemPrompt(style, userVoiceSamples) {
  const basePrompt = `You are an expert LinkedIn content creator specializing in high-converting carousel posts. Your task is to transform any content into a compelling 6 slide carousel that maximizes engagement.

# Output Format
IMPORTANT: Return ONLY valid JSON in this exact format, no other text:
{
  "slides": [
    {
      "slide_number": 1,
      "title": "Hook Title",
      "content": "Main content text for this slide",
      "notes": "Design suggestion or formatting note (optional)"
    },
    // ... more slides (6 total)
  ],
  "caption": "Full LinkedIn caption with line breaks and emojis",
  "pinned_comment": "Engaging pinned comment to boost engagement",
  "hooks": ["Alternative hook 1", "Alternative hook 2", "Alternative hook 3"]
}

# Carousel Structure
- Slide 1: HOOK - Grab attention with a bold statement, question, or surprising fact
- Slides 2: Problem/Context - Establish the pain point or situation
- Slides 3: Value/Content - Core insights, steps, or strategies
- Slide 4: Proof/Example - Case study, stats, or story
- Slide 5: CTA - Clear call-to-action (DM, comment, follow)
- Slide 6: Outro - Personal sign-off or brand reminder

# Writing Guidelines
- Keep each slide to 15-30 words MAX
- Use simple, punchy language
- Include specific numbers and examples
- Create scroll-stopping hooks
- End with clear next steps
- Use emojis sparingly in caption only

`

  const stylePrompts = {
    hormozi: `# Alex Hormozi Style
- Direct, no-fluff communication
- Lead with bold value propositions
- Use concrete numbers and proof ("$100M offers", "127 businesses")
- Frame everything as cause-effect relationships
- Include specific tactical steps
- End with strong, actionable CTAs
- Example phrases: "Here's what nobody tells you...", "The only 3 things that matter...", "If you do X, you'll get Y"
`,

    welsh: `# Justin Welsh Style
- Calm, conversational, helpful tone
- Share personal experience and lessons learned
- Break down complex ideas simply
- Use storytelling to illustrate points
- Focus on helping others grow
- Authentic and relatable
- Example phrases: "Here's what I learned...", "The simple truth is...", "This changed everything for me..."
`,

    koe: `# Dan Koe Style
- Deep, philosophical, thought-provoking
- Explore mindset and personal transformation
- Use metaphors and analogies
- Question conventional wisdom
- Focus on self-actualization and purpose
- Poetic but practical
- Example phrases: "Most people don't realize...", "The paradox is...", "Your mind is the ultimate..."
`,

    custom: userVoiceSamples
      ? `# Custom Voice (Trained on User's Posts)
Use the following writing samples to match the user's unique voice, tone, and style:

${userVoiceSamples}

Analyze these samples and replicate:
- Sentence structure and length
- Vocabulary and word choice
- Tone (formal/casual, serious/playful)
- Use of emojis, punctuation, formatting
- Common phrases or patterns
- Topics and themes
`
      : `# Custom Voice (Default)
- Professional yet approachable
- Clear and concise
- Action-oriented
- Data-driven when possible
- Engaging and conversational
`,
  }

  return basePrompt + stylePrompts[style]
}

/**
 * Parse carousel content from Claude's response
 */
function parseCarouselContent(responseText) {
  try {
    // Try to extract JSON from response (in case there's extra text)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('[generate-carousel] No valid JSON found in response')
      return null
    }

    const parsed = JSON.parse(jsonMatch[0])

    // Validate structure
    if (!parsed.slides || !Array.isArray(parsed.slides)) {
      console.error('[generate-carousel] Invalid response: missing slides array')
      return null
    }

    if (!parsed.caption || typeof parsed.caption !== 'string') {
      console.error('[generate-carousel] Invalid response: missing caption')
      return null
    }

    if (!parsed.pinned_comment || typeof parsed.pinned_comment !== 'string') {
      console.error('[generate-carousel] Invalid response: missing pinned_comment')
      return null
    }

    if (!parsed.hooks || !Array.isArray(parsed.hooks)) {
      console.error('[generate-carousel] Invalid response: missing hooks array')
      return null
    }

    // Validate slides
    for (let i = 0; i < parsed.slides.length; i++) {
      const slide = parsed.slides[i]
      if (
        typeof slide.slide_number !== 'number' ||
        typeof slide.title !== 'string' ||
        typeof slide.content !== 'string'
      ) {
        console.error(`[generate-carousel] Invalid slide structure at index ${i}`)
        return null
      }
    }

    return parsed
  } catch (error) {
    console.error('[generate-carousel] Failed to parse response:', error)
    return null
  }
}
