const MODEL = process.env.OPENAI_MODEL || "gpt-5.6-luna";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "POST method required"
    });
  }

  try {

    const {
      prompt,
      type = "general",
      language = "Hindi"
    } = req.body || {};

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required"
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "OPENAI_API_KEY is not configured"
      });
    }

    const systemPrompt = `
You are Zorvexa AI.

Task type:
${type}

Language:
${language}

Create high-quality original content.

For scripts and stories:
- Natural human-style writing
- Strong hook
- Good pacing
- Natural dialogue
- Clear scenes
- Avoid unnecessary AI-like wording
- Follow the user's requested format
`;

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },

        body: JSON.stringify({
          model: MODEL,

          input: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: prompt
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data
      });
    }

    return res.status(200).json({
      success: true,
      type,
      result: data.output_text || ""
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      error: error.message
    });

  }
}
