// api/pexels.js
export default async function handler(req, res) {
    const { endpoint, query, per_page } = req.query;
    const apiKey = process.env.PEXELS_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: "Pexels API key is not configured as an environment variable." });
    }

    let url = "";
    if (endpoint === "curated") {
        url = `https://api.pexels.com/v1/curated?per_page=${per_page || 10}`;
    } else if (endpoint === "search") {
        url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${per_page || 12}`;
    } else {
        return res.status(400).json({ error: "Invalid endpoint requested." });
    }

    try {
        const response = await fetch(url, {
            headers: { Authorization: apiKey }
        });
        if (!response.ok) throw new Error("Pexels API request failed");
        const data = await response.json();
        
        // Return JSON response with CORS headers if needed
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET");
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
