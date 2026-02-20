import type { PortfolioData, AIResponse } from "./types";

const API_BASE = "/api";

export async function fetchPortfolioData(): Promise<PortfolioData> {
    const res = await fetch(`${API_BASE}/data`);
    if (!res.ok) {
        throw new Error(`Failed to fetch portfolio data: ${res.status}`);
    }
    return res.json() as Promise<PortfolioData>;
}

export async function askAI(message: string): Promise<AIResponse> {
    const res = await fetch(`${API_BASE}/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
    });

    // Handle rate limit (429) — return the body so UI can show the message
    if (res.status === 429) {
        return res.json() as Promise<AIResponse>;
    }

    if (!res.ok) {
        throw new Error(`AI request failed: ${res.status}`);
    }

    return res.json() as Promise<AIResponse>;
}
