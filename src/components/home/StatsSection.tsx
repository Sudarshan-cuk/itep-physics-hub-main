import { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { SiteStatistic } from '../../integrations/supabase/types';
import { icons, LucideProps } from 'lucide-react'; // Import specific icons object and LucideProps

export const StatsSection = () => {
  const [statistics, setStatistics] = useState<SiteStatistic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      const { data, error } = await supabase.from('site_statistics').select('*');
      if (error) {
        console.error('Error fetching site statistics:', error);
      } else {
        setStatistics(data || []);
      }
      setLoading(false);
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return <section className="py-20 px-4 subtle-gradient border-t border-b border-border">Loading statistics...</section>;
  }

  return (
    <section className="py-20 px-4 subtle-gradient border-t border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statistics.map((stat) => {
            const IconComponent = icons[stat.icon_name as keyof typeof icons];
            return (
              <div key={stat.id} className="text-center group">
                <div className="flex items-center justify-center mb-4 text-primary group-hover:text-accent transition-colors duration-300">
                  {IconComponent && <IconComponent className="h-6 w-6" />}
                </div>
                <div className="text-4xl font-bold text-foreground mb-2 font-serif">{stat.display_value}</div>
                <div className="text-muted-foreground font-medium uppercase text-sm tracking-wider">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};