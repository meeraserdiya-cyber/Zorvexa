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
      style = "Cinematic"
    } = req.body || {};

    const apiKey =
      process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "OPENAI_API_KEY is not configured"
      });
    }

    const finalPrompt = `
Generate a clean professional background.

Style:
${style}

Description:
${prompt}

No unnecessary text.
No watermark.
Designed for creative video production.
`;

    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },

        body: JSON.stringify({
          model:
            process.env.OPENAI_IMAGE_MODEL ||
            "gpt-image-2",

          prompt: finalPrompt,

          n: 1
        })
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data
      });
    }

    return res.status(200).json({
      success: true,
      imageUrl:
        data.data?.[0]?.url || null,
      imageBase64:
        data.data?.[0]?.b64_json || null
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      error: error.message
    });

  }

}
