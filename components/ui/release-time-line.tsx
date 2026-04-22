'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Calendar, Sparkles, Zap } from 'lucide-react';

export type TimeLine_01Entry = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  description: string;
  items?: string[];
  image?: string;
  button?: {
    url: string;
    text: string;
  };
};

export interface TimeLine_01Props {
  title?: string;
  description?: string;
  entries?: TimeLine_01Entry[];
  className?: string;
}

export const defaultEntries: TimeLine_01Entry[] = [
  {
    icon: Calendar,
    title: 'Escola pública - Rumo Profissional',
    subtitle: 'Final da Escola - Decisão para qual rumo iria tomar',
    description:
      'Concluí meus estudos na rede pública e, ciente de que as oportunidades ali eram mais escassas, busquei me aperfeiçoar por conta própria. Fiz cursos de computação, me apaixonei pela área e, desde então, decidi que meu futuro seria na Tecnologia.',
    items: [
      'Educação',
      'Interesse por tecnologia',
      'Vontade de crescer através dos estudos',
    ],
    image: '/escola.png',
  },
  {
    icon: Sparkles,
    title: 'Primeiro Trabalho',
    subtitle: 'Jovem Aprendiz',
    description:
      'Meu primeiro trabalho foi sensacional e a realização de um grande sonho. Foi meu primeiro contato com o mundo corporativo, onde fiz novas amizades e adquiri muitos aprendizados, especialmente o interesse genuíno em entender e resolver problemas. Sou muito grato por essa experiência que me marcou tanto. Infelizmente, uma semana antes da minha efetivação, precisei fazer uma escolha difícil e deixar o cargo para seguir um sonho ainda maior: minha faculdade.',
    items: [
      'Mercado de trabalho',
      'Novos interesses',
      'Grandes aprendizados',
    ],
    image: '/trabalho.png',
  },
  {
    icon: Zap,
    title: 'Faculdade',
    subtitle: 'Engenharia de Software',
    description:
      'Conseguir uma bolsa de 100% no Ibmec foi um dos momentos mais marcantes da minha vida. Ali, percebi que, através dos estudos, eu realmente poderia mudar minha realidade. Foi uma conquista que transformou minha trajetória e abriu portas que eu antes não imaginava. A cada dia sou mais grato a Deus, pois entendi que, com dedicação e esforço, posso chegar onde eu quiser.',
    items: [
      'Grande conquista acadêmica',
      'Nova fase da vida',
      'Foco no crescimento profissional',
    ],
    image: '/logo.png',
  },
];

export default function TimeLine_01({
  entries = defaultEntries,
}: TimeLine_01Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sentinelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setSentinelRef = (el: HTMLDivElement | null, i: number) => {
    sentinelRefs.current[i] = el;
  };

  useEffect(() => {
    if (!sentinelRefs.current.length) return;

    let ticking = false;

    const updateActive = () => {
      const centerY = window.innerHeight / 3;
      let bestIndex = 0;
      let bestDist = Infinity;

      sentinelRefs.current.forEach((node, i) => {
        if (!node) return;

        const rect = node.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        const dist = Math.abs(mid - centerY);

        if (dist < bestDist) {
          bestDist = dist;
          bestIndex = i;
        }
      });

      setActiveIndex((prev) => (prev !== bestIndex ? bestIndex : prev));
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateActive);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateActive();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-4xl space-y-14 md:space-y-20">
          {entries.map((entry, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={index}
                className="relative flex flex-col gap-4 md:flex-row md:gap-14"
                aria-current={isActive ? 'true' : 'false'}
              >
                <div className="top-8 flex h-min w-full shrink-0 items-center gap-4 md:sticky md:w-64">
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-lg p-2 transition-all ${
                        isActive ? 'bg-white text-black' : 'bg-zinc-800/80 text-zinc-400'
                      }`}
                    >
                      <entry.icon className="h-4 w-4" />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">
                        {entry.title}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {entry.subtitle}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  ref={(el) => setSentinelRef(el, index)}
                  aria-hidden
                  className="absolute -top-24 left-0 h-12 w-12 opacity-0"
                />

                <article className="flex w-full flex-col p-0 transition-all duration-300">
                  {entry.image && (
                    <img
                      src={entry.image}
                      alt={entry.title}
                      className="mb-4 h-72 w-full rounded-2xl object-cover"
                      loading="lazy"
                    />
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h2
                        className={`text-md font-medium leading-tight tracking-tight md:text-lg ${
                          isActive ? 'text-white' : 'text-zinc-300'
                        }`}
                      >
                        {entry.title}
                      </h2>

                      <p
                        className={`text-xs leading-relaxed md:text-sm ${
                          isActive ? 'text-zinc-400' : 'line-clamp-2 text-zinc-500'
                        }`}
                      >
                        {entry.description}
                      </p>
                    </div>

                    <div
                      aria-hidden={!isActive}
                      className={`grid overflow-hidden transition-all duration-500 ease-out ${
                        isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="space-y-4 pt-2">
                          {entry.items && entry.items.length > 0 && (
                            <div className="rounded-xl border border-white/8 bg-black/20 p-4">
                              <ul className="space-y-2">
                                {entry.items.map((item, itemIndex) => (
                                  <li
                                    key={itemIndex}
                                    className="flex items-start gap-2 text-sm text-zinc-400"
                                  >
                                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />
                                    <span className="leading-relaxed">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {entry.button && (
                            <div className="flex justify-end">
                              <a
                                href={entry.button.url}
                                target="_blank"
                                rel="noreferrer"
                                className="group inline-flex items-center justify-center rounded-lg bg-white px-3 py-2 text-xs font-medium text-black transition-all duration-200 hover:bg-zinc-200"
                              >
                                {entry.button.text}
                                <ArrowUpRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}