import generate from "./generate.js";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "POST method required"
    });
  }

  req.body = {
    ...req.body,
    type: "story"
  };

  return generate(req, res);
}
