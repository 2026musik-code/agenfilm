import { DramaData, DramaResponse } from "@/types/drama";

export async function getDramaData(): Promise<DramaData | null> {
  try {
    const res = await fetch("https://magma-api.biz.id/dramabox/vip", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const json: DramaResponse = await res.json();

    if (json.status !== true) {
      console.error("API returned status false");
      return null;
    }

    return json.data;
  } catch (error) {
    console.error("Failed to fetch drama data:", error);
    return null;
  }
}
