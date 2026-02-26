import { useState } from "react";

export default function Home() {
  const [cookies, setCookies] = useState("");
  const [target, setTarget] = useState("json");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleConvert() {
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ cookies, target })
      });

      const data = await res.json();

      if (data.success) {
        setResult(
          typeof data.result === "object"
            ? JSON.stringify(data.result, null, 2)
            : data.result
        );
      } else {
        setResult(data.error || "Error");
      }

    } catch (err) {
      setResult("Request failed");
    }

    setLoading(false);
  }

  return (
    <div style={styles.container}>
      <h1>Cookie Converter API UI</h1>

      <textarea
        placeholder="Paste cookies here..."
        value={cookies}
        onChange={(e) => setCookies(e.target.value)}
        style={styles.textarea}
      />

      <select
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        style={styles.select}
      >
        <option value="json">Convert to JSON</option>
        <option value="netscape">Convert to Netscape</option>
        <option value="header">Convert to Header</option>
        <option value="raw">Convert to RAW</option>
      </select>

      <button onClick={handleConvert} style={styles.button}>
        {loading ? "Converting..." : "Convert"}
      </button>

      <h3>Result</h3>

      <textarea
        value={result}
        readOnly
        style={{ ...styles.textarea, background: "#f4f4f4" }}
      />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial"
  },
  textarea: {
    width: "100%",
    height: "150px",
    marginBottom: "15px",
    padding: "10px"
  },
  select: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px"
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "black",
    color: "white",
    border: "none",
    cursor: "pointer"
  }
};
