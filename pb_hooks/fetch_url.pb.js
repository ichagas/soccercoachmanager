/// <reference path="../pb_data/types.d.ts" />
// routerAdd("POST", "/api/fetch-url", (e) => {

//   console.log("Handling fetch URL request")
//   const body = new DynamicModel({
//     "url": ""
//   });

//   e.bind(body);
//   const { url } = body;

  
// return e.json(200, {"success": true})
// })
// console.log("Registered route: POST /api/fetch-url")

// /**
//  * URL Fetching Hook
//  *
//  * Endpoint: POST /api/fetch-url
//  * Purpose: Fetch content from URLs and extract clean text
//  *
//  * Request body:
//  * {
//  *   "url": "https://example.com/article"
//  * }
//  *
//  * Response:
//  * {
//  *   "success": true,
//  *   "text": "Extracted content...",
//  *   "title": "Page title",
//  *   "url": "https://example.com/article"
//  * }
//  */

// /// <reference path="../pb_data/types.d.ts" />
routerAdd("POST", "/api/fetch-url", (e) => {
    /**
   * Extract clean text from HTML
   */
  function extractTextFromHTML(html) {

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : ''

    // Remove script and style tags
    let text = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '')

    // Remove HTML comments
    text = text.replace(/<!--[\s\S]*?-->/g, '')

    // Try to extract main content area
    // Look for common content containers
    const contentMatch =
      text.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
      text.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ||
      text.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
      text.match(/<div[^>]*class="[^"]*post[^"]*"[^>]*>([\s\S]*?)<\/div>/i)

    if (contentMatch) {
      text = contentMatch[1]
    }

    // Remove all HTML tags
    text = text.replace(/<[^>]+>/g, ' ')

    // Decode HTML entities
    text = text
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&mdash;/g, '—')
      .replace(/&ndash;/g, '–')
      .replace(/&rsquo;/g, "'")
      .replace(/&lsquo;/g, "'")
      .replace(/&rdquo;/g, '"')
      .replace(/&ldquo;/g, '"')

    // Clean up whitespace
    text = text
      .replace(/\s+/g, ' ') // Multiple spaces to single space
      .replace(/\n\s*\n/g, '\n\n') // Multiple newlines to double newline
      .trim()

    // Limit length (max 50000 characters to avoid issues)
    if (text.length > 50000) {
      text = text.substring(0, 50000) + '...'
    }

    return { text, title }
  }

  console.log("Handling fetch URL request")
  try {

    const body = new DynamicModel({
      "url": ""
    });

    e.bind(body);
    const { url } = body;

    // Validate URL
    if (!url) {
      return e.json(400, {
        success: false,
        error: 'URL is required',
      })
    }

    // Validate URL format

    // try {
    //   console.log("Parsed URL:", url)
    //   const parsedUrl = new URL(url)
    //   console.log("Parsed URL object:", parsedUrl.protocol)

    //   if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    //     throw new Error('Only HTTP and HTTPS URLs are supported')
    //   }
    // } catch (err) {
    //   return e.json(400, {
    //     success: false,
    //     error: 'Invalid URL format. ' + err.message
    //   })
    // }

    let title = "";
    let text = "";

    try {
      console.log("Parsed URL:", url)
      const res = $http.send({
          url: url,
          method:  "GET",
          body:    "", // ex. JSON.stringify({"test": 123}) or new FormData()
          headers: {"content-type": "text/html"}, // ex. {"content-type": "application/json"}
          timeout: 30, // in seconds
      })

      const extractedBody = extractTextFromHTML(res.raw);
      text = extractedBody.text;
      title = extractedBody.title;
      
    } catch (err) {
      return e.json(500, {
        success: false,
        error: 'Failed to fetch URL: ' + err.message,
      })
    }

    // // Fetch URL content with timeout
    // const controller = new AbortController()

    // let response
    // try {
    //   response = fetch(url, {
    //     signal: controller.signal,
    //     headers: {
    //       'User-Agent':
    //         'Mozilla/5.0 (compatible; ApexCarouselBot/1.0; +https://apexcarousel.com)',
    //     },
    //   })
    // } catch (err) {
    //   if (err.name === 'AbortError') {
    //     return e.json(408, {
    //       success: false,
    //       error: 'Request timeout - URL took too long to respond',
    //     })
    //   }
    //   return e.json(500, {
    //     success: false,
    //     error: 'Failed to fetch URL: ' + err.message,
    //   })
    // }

    // // Check response status
    // if (!response.ok) {
    //   return e.json(response.status, {
    //     success: false,
    //     error: `Failed to fetch URL: HTTP ${response.status}`,
    //   })
    // }

    // // Get content type
    // const contentType = response.headers.get('content-type') || ''

    // // Only process HTML/text content
    // if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
    //   return e.json(400, {
    //     success: false,
    //     error: 'URL must return HTML or text content',
    //   })
    // }

    // // Get response text
    // const html = response.text()

    // // Extract text and title from HTML
    // const { text, title } = extractTextFromHTML(html)

    // if (!text || text.length < 100) {
    //   return e.json(400, {
    //     success: false,
    //     error: 'URL content is too short or could not be extracted',
    //   })
    // }

    // Return success response
    return e.json(200, {
      success: true,
      text: text,
      title: title || 'Untitled',
      url: url,
    })
  } catch (err) {
    console.error('[fetch-url] Error:', err)
    return e.json(500, {
      success: false,
      error: 'Internal server error: ' + err.message,
    })
  }
})


