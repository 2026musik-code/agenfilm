import { DramaColumn } from "@/types/drama";
import { fetchVIP, fetchList, fetchNetshortList, fetchDubIndoList } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Section from '@/components/Section';

export default async function Home() {
  const [
    vipData,
    latestData,
    trendingData,
    foryouData,
    dubindoData,
    randomData,
    netshortForyou,
    netshortTheaters
  ] = await Promise.all([
    fetchVIP(),
    fetchList('latest'),
    fetchList('trending'),
    fetchList('foryou'),
    fetchDubIndoList(), // Use the new specific endpoint/params
    fetchList('random'),
    fetchNetshortList('foryou'),
    fetchNetshortList('theaters')
  ]);

  // Determine Hero Drama - prioritize NetShort Theaters for freshness, then Random, then VIP
  const heroDrama = netshortTheaters?.[0] || randomData?.[0] || vipData?.columnVoList?.[0]?.bookList?.[0];

  return (
    <main className="min-h-screen bg-luxury-black text-white selection:bg-luxury-gold selection:text-black">
      <Navbar />

      {heroDrama && <Hero drama={heroDrama} />}

      <div className="pb-20 space-y-8 md:space-y-16 -mt-20 relative z-20">

        {/* NetShort Theaters - High Priority */}
        {netshortTheaters && netshortTheaters.length > 0 && (
          <Section
            title="Theaters"
            subTitle="NetShort Premieres"
            bookList={netshortTheaters}
          />
        )}

        {/* NetShort Recommendations */}
        {netshortForyou && netshortForyou.length > 0 && (
          <Section
            title="NetShort Picks"
            subTitle="Recommended by NetShort"
            bookList={netshortForyou}
          />
        )}

        {/* Render VIP Columns (from original structure) */}
        {vipData?.columnVoList?.map((column: DramaColumn) => (
          <Section
            key={`vip-${column.columnId}`}
            title={column.title}
            subTitle={column.subTitle}
            bookList={column.bookList}
            columnId={column.columnId}
          />
        ))}

        {/* Indonesian Dubbed - Prioritized as requested */}
        {dubindoData && dubindoData.length > 0 && (
          <Section
            title="Indonesian Dubbed"
            subTitle="Watch in your language (Terbaru)"
            bookList={dubindoData}
          />
        )}

        {/* Standard Sections */}
        {latestData.length > 0 && (
          <Section title="Latest Releases" subTitle="Fresh from the studio" bookList={latestData} />
        )}

        {trendingData.length > 0 && (
          <Section title="Trending Now" subTitle="Most watched this week" bookList={trendingData} />
        )}

         {foryouData.length > 0 && (
          <Section title="Recommended For You" subTitle="Curated selections" bookList={foryouData} />
        )}

      </div>

      <footer className="py-10 text-center text-gray-500 border-t border-luxury-gray/30 mt-10">
        <p>&copy; {new Date().getFullYear()} LUXEDRAMA. All rights reserved.</p>
        <p className="text-xs mt-2">Premium Asian Drama Streaming Experience</p>
      </footer>
    </main>
  );
}
