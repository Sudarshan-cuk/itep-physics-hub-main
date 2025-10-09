import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { ArrowRight } from 'lucide-react';

export const HeroSection = () => {
  const { user, isApproved } = useAuth();

  return (
    <section className="relative physics-pattern py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-academic opacity-5"></div>
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
            ITEP HUB
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Integrated Teacher Education Program - Empowering Future Educators Across Disciplines
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          {user && isApproved ? (
            <Link to="/notes">
              <Button size="lg" className="w-full sm:w-auto">
                Access Study Materials <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
          <Link to="/about">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};