import generate from "./generate.js";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "POST method required"
    });
  }

  const {
    story,
    scenes = 8,
    style = "Cinematic"
  } = req.body || {};

  req.body = {

    prompt: `
Convert this story into a ${scenes}-scene storyboard.

Visual style:
${style}

For every scene provide:

Scene number
Location
Characters
Action
Camera angle
Lighting
Visual prompt

Story:

${story}
`,

    type: "storyboard",

    language: "English"

  };

  return generate(req, res);

}
