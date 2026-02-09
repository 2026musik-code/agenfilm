import {
  Drama,
  DramaResponse,
  DramaListResponse,
  EpisodeResponse,
  Episode
} from "@/types/drama";

const BASE_URL = "https://magma-api.biz.id/dramabox";

// Helper to normalize drama objects (handle different field names)
function normalizeDrama(item: any): Drama {
  return {
    ...item,
    coverWap: item.coverWap || item.bookCover || "", // Fallback
    chapterCount: item.chapterCount || 0,
    introduction: item.introduction || "",
  };
}

export async function fetchVIP(): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}/vip`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json: DramaResponse = await res.json();
    if (!json.status) return null;
    return json.data;
  } catch (error) {
    console.error("Failed to fetch VIP data:", error);
    return null;
  }
}

export async function fetchList(endpoint: string): Promise<Drama[]> {
  try {
    const res = await fetch(`${BASE_URL}/${endpoint}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json: DramaListResponse = await res.json();
    if (!json.status || !Array.isArray(json.data)) return [];
    return json.data.map(normalizeDrama);
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    return [];
  }
}

export async function fetchSearch(query: string): Promise<Drama[]> {
  try {
    const res = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json: DramaListResponse = await res.json();
    if (!json.status || !Array.isArray(json.data)) return [];
    return json.data.map(normalizeDrama);
  } catch (error) {
    console.error(`Failed to search for ${query}:`, error);
    return [];
  }
}

export async function fetchPopularSearch(): Promise<Drama[]> {
    return fetchList("populersearch");
}

export async function fetchEpisodes(bookId: string): Promise<Episode[]> {
  try {
    const res = await fetch(`${BASE_URL}/allepisode?bookId=${bookId}`, {
      cache: 'no-store' // Episodes might update or expire
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json: EpisodeResponse = await res.json();
    if (!json.status || !Array.isArray(json.data)) return [];
    return json.data;
  } catch (error) {
    console.error(`Failed to fetch episodes for ${bookId}:`, error);
    return [];
  }
}

export async function fetchDramaDetails(id: string): Promise<Drama | null> {
  // Try to find in VIP first (most likely place for detailed catalog)
  const vipData = await fetchVIP();
  if (vipData?.columnVoList) {
    for (const col of vipData.columnVoList) {
       const found = col.bookList.find((d: Drama) => d.bookId === id);
       if (found) return normalizeDrama(found);
    }
  }

  // If not found, check other lists in parallel
  const [latest, trending, foryou, dubindo, random] = await Promise.all([
    fetchList('latest'),
    fetchList('trending'),
    fetchList('foryou'),
    fetchList('dubindo'),
    fetchList('random')
  ]);

  const allLists = [...latest, ...trending, ...foryou, ...dubindo, ...random];
  const found = allLists.find(d => d.bookId === id);

  if (found) return found;

  // Last resort: search for ID (though we know it doesn't work well)
  // Or return null
  return null;
}

// Re-export old function name for compatibility if needed, but better to update usage.
export const getDramaData = fetchVIP;
