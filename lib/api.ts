import { DramaData,
  Drama,
  DramaResponse,
  DramaListResponse,
  EpisodeResponse,
  Episode
} from "@/types/drama";

const BASE_URL = "https://magma-api.biz.id/dramabox";
const NETSHORT_BASE_URL = "https://magma-api.biz.id/netshort";

// Helper to normalize drama objects (handle different field names)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeDrama(item: Record<string, any>): Drama {
  return {
    ...item,
    coverWap: item.coverWap || item.bookCover || item.cover || "", // Fallback
    chapterCount: item.chapterCount || item.totalChapter || 0,
    introduction: item.introduction || "",
    bookId: item.bookId || item.id || "", // Ensure required props exist
    bookName: item.bookName || item.title || "",
  } as Drama;
}

export async function fetchVIP(): Promise<DramaData | null> {
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

// New NetShort API fetchers
export async function fetchNetshortList(endpoint: string): Promise<Drama[]> {
  try {
    const res = await fetch(`${NETSHORT_BASE_URL}/${endpoint}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json: DramaListResponse = await res.json();

    // NetShort API might return slightly different structure, handle gracefully
    // Assuming standard response format based on domain similarity
    if (!json.status || !Array.isArray(json.data)) return [];
    return json.data.map(normalizeDrama);
  } catch (error) {
    console.error(`Failed to fetch NetShort ${endpoint}:`, error);
    return [];
  }
}

export async function fetchNetshortSearch(query: string): Promise<Drama[]> {
  try {
    const res = await fetch(`${NETSHORT_BASE_URL}/search?query=${encodeURIComponent(query)}`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json: DramaListResponse = await res.json();
    if (!json.status || !Array.isArray(json.data)) return [];
    return json.data.map(normalizeDrama);
  } catch (error) {
    console.error(`Failed to search NetShort for ${query}:`, error);
    return [];
  }
}

// Updated DubIndo fetcher with specific params
export async function fetchDubIndoList(): Promise<Drama[]> {
    try {
        const res = await fetch(`${BASE_URL}/dubindo?classify=Terbaru&page=1`, { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const json: DramaListResponse = await res.json();
        if (!json.status || !Array.isArray(json.data)) return [];
        return json.data.map(normalizeDrama);
    } catch (error) {
        console.error("Failed to fetch DubIndo list:", error);
        return [];
    }
}

// Updated main search to combine both (or prioritize NetShort as requested)
export async function fetchSearch(query: string): Promise<Drama[]> {
  try {
    // Run both searches in parallel
    const [dramaboxResults, netshortResults] = await Promise.all([
        // Original fetch logic
        fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}`, { cache: 'no-store' })
            .then(res => res.json())
            .then(json => (json.status && Array.isArray(json.data) ? json.data.map(normalizeDrama) : []))
            .catch(() => []),

        // New NetShort fetch logic
        fetch(`${NETSHORT_BASE_URL}/search?query=${encodeURIComponent(query)}`, { cache: 'no-store' })
            .then(res => res.json())
            .then(json => (json.status && Array.isArray(json.data) ? json.data.map(normalizeDrama) : []))
            .catch(() => [])
    ]);

    // Combine results, prioritizing NetShort as requested ("pakai api ini")
    // Use a Map to deduplicate by bookId if necessary
    const uniqueMap = new Map();
    [...netshortResults, ...dramaboxResults].forEach(item => {
        if (!uniqueMap.has(item.bookId)) {
            uniqueMap.set(item.bookId, item);
        }
    });

    return Array.from(uniqueMap.values());
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
      cache: 'no-store'
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
  // Try to find in VIP first
  const vipData = await fetchVIP();
  if (vipData?.columnVoList) {
    for (const col of vipData.columnVoList) {
       const found = col.bookList.find((d: Drama) => d.bookId === id);
       if (found) return normalizeDrama(found);
    }
  }

  // Check other lists in parallel, now including NetShort sources
  const [latest, trending, foryou, dubindo, random, netShortForYou, netShortTheaters] = await Promise.all([
    fetchList('latest'),
    fetchList('trending'),
    fetchList('foryou'),
    fetchDubIndoList(),
    fetchList('random'),
    fetchNetshortList('foryou'),
    fetchNetshortList('theaters')
  ]);

  const allLists = [...latest, ...trending, ...foryou, ...dubindo, ...random, ...netShortForYou, ...netShortTheaters];
  const found = allLists.find(d => d.bookId === id);

  if (found) return found;

  return null;
}

export const getDramaData = fetchVIP;
