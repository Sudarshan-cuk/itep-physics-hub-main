import { BookOpen, GraduationCap, Microscope, Award } from 'lucide-react';

const stats = [
  { icon: <GraduationCap className="h-6 w-6" />, label: "Students", value: "500+" },
  { icon: <Microscope className="h-6 w-6" />, label: "Research Areas", value: "15+" },
  { icon: <Award className="h-6 w-6" />, label: "Faculty", value: "25+" },
  { icon: <BookOpen className="h-6 w-6" />, label: "Resources", value: "1000+" }
];

export const StatsSection = () => {
  return (
    <section className="py-20 px-4 subtle-gradient border-t border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="flex items-center justify-center mb-4 text-primary group-hover:text-accent transition-colors duration-300">
                {stat.icon}
              </div>
              <div className="text-4xl font-bold text-foreground mb-2 font-serif">{stat.value}</div>
              <div className="text-muted-foreground font-medium uppercase text-sm tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};