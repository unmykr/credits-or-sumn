import Navbar from '@/components/layout/Navbar';
import { Link } from 'react-router-dom';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import PortalCards from '@/components/home/PortalCards';

const Index = () => {
  // We check the document direction to support both Arabic and English tooltips
  const isRTL = document.dir === 'rtl';

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <PortalCards />
      </main>

      {/* --- FLOATING BOOKMARK BUTTON --- */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] group">
        {/* Hover Tooltip */}
        <div className={`absolute ${isRTL ? 'left-full ml-3' : 'right-full mr-3'} top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl`}>
          {isRTL ? 'دليل استخدام البوابة' : "Teacher's Instruction Booklet"}
        </div>

        {/* Square Button with Round Edges */}
        <Link 
          to="/manual/teacher"
          className="w-14 h-14 bg-white border-2 border-slate-200 shadow-2xl rounded-xl flex items-center justify-center hover:bg-slate-50 hover:border-primary hover:scale-110 transition-all duration-300 active:scale-95"
          aria-label="Instruction Booklet"
        >
          {/* Black Bookmark Icon */}
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="black" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M19 21L12 16L5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21Z" 
              stroke="black" 
              strokeWidth="1" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default Index;