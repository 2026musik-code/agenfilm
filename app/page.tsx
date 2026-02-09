import { getDramaData } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Section from '@/components/Section';

export default async function Home() {
  const data = await getDramaData();

  if (!data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Failed to load data. Please try again later.</p>
      </div>
    );
  }

  // Select a hero drama - try to find one with high quality cover
  // Prefer the first item of the first column
  const heroDrama = data.columnVoList?.[0]?.bookList?.[0];

  return (
    <main className="min-h-screen bg-luxury-black text-white selection:bg-luxury-gold selection:text-black">
      <Navbar />

      {heroDrama && <Hero drama={heroDrama} />}

      <div className="pb-20 space-y-8 md:space-y-16 -mt-20 relative z-20">
        {data.columnVoList.map((column) => (
          <Section key={column.columnId} column={column} />
        ))}
      </div>

      <footer className="py-10 text-center text-gray-500 border-t border-luxury-gray/30 mt-10">
        <p>&copy; {new Date().getFullYear()} LUXEDRAMA. All rights reserved.</p>
        <p className="text-xs mt-2">Premium Asian Drama Streaming Experience</p>
      </footer>
    </main>
  );
}
