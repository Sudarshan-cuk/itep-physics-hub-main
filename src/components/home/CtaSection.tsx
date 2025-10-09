import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { ArrowRight } from 'lucide-react';

export const CtaSection = () => {
  const { user } = useAuth();

  return (
    <section className="py-24 px-4 academic-gradient text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-white/20 rounded-full"></div>
      </div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl font-bold mb-6 font-serif">Ready to Join Our ITEP Community?</h2>
        <p className="text-xl mb-10 opacity-95 leading-relaxed font-light">
          Designed for all student teachers at Central University of Kerala, offering ITEP B.Sc. (Physics, Zoology), ITEP B.A. (English, Economics), and B.Com.
          Get access to exclusive study materials, connect with peers, and stay updated with your chosen discipline.
        </p>
        {!user && (
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4 rounded-full hover:scale-105 transition-transform">
              Begin Your Journey <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
};