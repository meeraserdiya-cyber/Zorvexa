export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "POST method required"
    });
  }

  try {

    const {
      text,
      voice = "alloy"
    } = req.body || {};

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: "Text is required"
      });
    }

    const apiKey =
      process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "OPENAI_API_KEY is not configured"
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/audio/speech",
      {
        method: "POST",

        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          model:
            process.env.OPENAI_TTS_MODEL ||
            "gpt-4o-mini-tts",

          voice,

          input: text,

          response_format: "mp3"
        })
      }
    );

    if (!response.ok) {

      const error =
        await response.text();

      return res.status(response.status).json({
        success: false,
        error
      });

    }

    const audioBuffer =
      Buffer.from(
        await response.arrayBuffer()
      );

    res.setHeader(
      "Content-Type",
      "audio/mpeg"
    );

    res.setHeader(
      "Content-Length",
      audioBuffer.length
    );

    return res.status(200).send(
      audioBuffer
    );

  } catch (error) {

    return res.status(500).json({
      success: false,
      error: error.message
    });

  }

    }
