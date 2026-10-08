// ALSA AI - Web Search
export interface WebSearchResult {
  title: string;
  snippet: string;
  url: string;
}

export interface WebSearchResponse {
  query: string;
  results: WebSearchResult[];
  searchUrl: string;
}

export const webSearch = async (
  query: string
): Promise<WebSearchResponse> => {
  const cleanQuery = query.trim();

  if (!cleanQuery) {
    return {
      query: "",
      results: [],
      searchUrl: "https://www.google.com/search?q=",
    };
  }

  const encoded = encodeURIComponent(cleanQuery);

  const searchUrl = `https://www.google.com/search?q=${encoded}`;

  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encoded}&format=json&origin=*&utf8=1&srlimit=8`
    );

    if (!response.ok) {
      throw new Error(`Search request failed: ${response.status}`);
    }

    const data = await response.json();

    const results: WebSearchResult[] = (data?.query?.search || []).map(
      (item: any) => ({
        title: item.title,
        snippet: String(item.snippet || "")
          .replace(/<[^>]*>/g, "")
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'")
          .replace(/&amp;/g, "&"),
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(
          String(item.title).replace(/ /g, "_")
        )}`,
      })
    );

    return {
      query: cleanQuery,
      results,
      searchUrl,
    };
  } catch (error) {
    console.error("Web search error:", error);

    return {
      query: cleanQuery,
      results: [],
      searchUrl,
    };
  }
};