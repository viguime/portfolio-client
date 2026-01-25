import { useEffect, useState } from 'react';

const techs = ['React', 'TypeScript', 'Node'];

export function Hero() {
  const [visibleTechs, setVisibleTechs] = useState<number[]>([]);

  useEffect(() => {
    techs.forEach((_, index) => {
      setTimeout(() => {
        setVisibleTechs(prev => [...prev, index]);
      }, index * 300);
    });
  }, []);

  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20">
      <h1 className="text-5xl md:text-7xl font-bold text-center mb-6">
        José Victor Meireles Guimarães
      </h1>
      <div className="flex flex-wrap items-center justify-center gap-2 text-xl md:text-2xl text-muted-foreground">
        <span>Full-stack developer</span>
        <span>|</span>
        {techs.map((tech, index) => (
          <span key={tech} className="flex items-center gap-2">
            <span
              className={`transition-opacity duration-500 ${
                visibleTechs.includes(index) ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 300}ms` }}
            >
              {tech}
            </span>
            {index < techs.length - 1 && <span>•</span>}
          </span>
        ))}
      </div>
    </section>
  );
}
