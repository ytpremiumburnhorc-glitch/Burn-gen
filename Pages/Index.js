async function handleConvert() {
  setLoading(true);
  setResult("");

  try {
    const res = await fetch("/api/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cookies, target })
    });

    const data = await res.json();

    if (data.success) {
      setResult(JSON.stringify(data, null, 2));
    } else {
      setResult(data.error || "Error");
    }

  } catch (err) {
    setResult("Request failed");
  }

  setLoading(false);
}
