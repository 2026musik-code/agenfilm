export default function Loading() {
  return (
    <div className="fixed inset-0 bg-luxury-black flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-luxury-gray opacity-20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-luxury-gold border-t-transparent animate-spin"></div>
        </div>
        <div className="mt-4 text-luxury-gold font-serif tracking-widest text-sm animate-pulse">
          LUXEDRAMA
        </div>
      </div>
    </div>
  );
}
