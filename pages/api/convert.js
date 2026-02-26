export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { cookies, target } = req.body;

  if (!cookies || !target) {
    return res.status(400).json({ error: "Missing cookies or target format" });
  }

  function detectFormat(input) {
    input = input.trim();

    if (input.startsWith("{") || input.startsWith("[")) return "json";
    if (input.includes("\t")) return "netscape";
    if (input.includes("=") && input.includes(";")) return "header";
    if (input.includes("=")) return "raw";

    return "unknown";
  }

  function parseToArray(input) {
    const format = detectFormat(input);
    let result = [];

    if (format === "json") {
      result = JSON.parse(input);
    }

    else if (format === "netscape") {
      const lines = input.split("\n");
      lines.forEach(line => {
        if (!line.startsWith("#") && line.trim()) {
          const parts = line.split("\t");
          result.push({
            domain: parts[0],
            name: parts[5],
            value: parts[6]
          });
        }
      });
    }

    else if (format === "header" || format === "raw") {
      const pairs = input.split(/;|\n/);
      pairs.forEach(pair => {
        const [name, value] = pair.split("=");
        if (name && value) {
          result.push({
            name: name.trim(),
            value: value.trim()
          });
        }
      });
    }

    return result;
  }

  try {
    const parsed = parseToArray(cookies);
    let output = "";

    if (target === "json") {
      output = parsed;
    }

    else if (target === "header") {
      output = parsed.map(c => `${c.name}=${c.value}`).join("; ");
    }

    else if (target === "raw") {
      output = parsed.map(c => `${c.name}=${c.value}`).join("\n");
    }

    else if (target === "netscape") {
      output = parsed.map(c =>
        `${c.domain || "example.com"}\tTRUE\t/\tFALSE\t0\t${c.name}\t${c.value}`
      ).join("\n");
    }

    res.status(200).json({
      success: true,
      detectedFormat: detectFormat(cookies),
      result: output
    });

  } catch (err) {
    res.status(400).json({ error: "Invalid format" });
  }
}
