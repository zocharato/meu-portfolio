'use client';

import React, { useEffect, useState } from 'react';
import {
  Mail,
  Briefcase,
  FolderGit2,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';

const socialPlatforms = [
  {
    name: 'Email',
    icon: <Mail className="w-7 h-7" />,
    gradient: 'from-blue-600 to-cyan-500',
    shadowColor: 'rgba(59, 130, 246, 0.45)',
    link: 'https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox?compose=DmwnWrRqhkkJpxQrFzJMQcBzGNvzgXLlCWlWTTQqXtdDnpDxhvLzzMpmbQzVtHzdbmPrFQxsXDDb',
    description: 'Me envie um email',
  },
  {
    name: 'LinkedIn',
    icon: <Briefcase className="w-7 h-7" />,
    gradient: 'from-blue-700 to-blue-500',
    shadowColor: 'rgba(37, 99, 235, 0.45)',
    link: 'https://www.linkedin.com/in/gustavo-zocharato-ferreira',
    description: 'Veja meu perfil profissional',
  },
  {
    name: 'GitHub',
    icon: <FolderGit2 className="w-7 h-7" />,
    gradient: 'from-zinc-700 to-zinc-500',
    shadowColor: 'rgba(113, 113, 122, 0.45)',
    link: 'https://github.com/zocharato',
    description: 'Conheça meus projetos',
  },
  {
    name: 'WhatsApp',
    icon: <MessageCircle className="w-7 h-7" />,
    gradient: 'from-emerald-600 to-green-500',
    shadowColor: 'rgba(16, 185, 129, 0.45)',
    link: 'https://wa.me/5511953921552?text=Ol%C3%A1%2C%20vi%20seu%20portf%C3%B3lio%20e%20quero%20falar%20com%20voc%C3%AA',
    description: 'Fale comigo diretamente',
  },
];

export default function GetInTouch() {
  const [, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full">
      
      <div className="relative z-10 flex min-h-[620px] flex-col items-center justify-center px-6 py-16 md:px-10">
        <div
          className={`mb-14 text-center transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >

          <h3 className="bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl">
            Vamos nos conectar
          </h3>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
            Você pode falar comigo por email, conhecer meu LinkedIn, ver meus
            projetos no GitHub ou me chamar no WhatsApp.
          </p>
        </div>

        <div className="grid w-full max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {socialPlatforms.map((platform, index) => (
            <a
              key={platform.name}
              href={platform.link}
              target={platform.link.startsWith('mailto:') ? '_self' : '_blank'}
              rel={platform.link.startsWith('mailto:') ? undefined : 'noreferrer'}
              className={`group relative transition-all duration-700 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 120}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-7 backdrop-blur-xl transition-all duration-500 hover:scale-[1.03] hover:border-slate-500/60">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${platform.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
                />

                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${platform.shadowColor}, transparent 70%)`,
                    filter: 'blur(40px)',
                  }}
                />

                <div className="relative z-10">
                  <div
                    className={`mb-5 inline-flex rounded-xl bg-gradient-to-br ${platform.gradient} p-3 text-white transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110`}
                  >
                    {platform.icon}
                  </div>

                  <h4 className="mb-1 text-lg font-semibold text-white">
                    {platform.name}
                  </h4>

                  <p className="text-sm text-zinc-400 transition-colors duration-300 group-hover:text-zinc-300">
                    {platform.description}
                  </p>

                  <div className="mt-5 flex items-center text-sm font-medium text-zinc-500 transition-colors duration-300 group-hover:text-white">
                    <span>Acessar</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>

                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              </div>
            </a>
          ))}
        </div>
      </div>

      <div
        className="pointer-events-none fixed h-96 w-96 rounded-full opacity-20 blur-[100px] transition-all duration-200 ease-out"
        style={{
          background:
            'radial-gradient(circle, rgba(147, 51, 234, 0.28), transparent)',
          left: `${mousePosition.x - 192}px`,
          top: `${mousePosition.y - 192}px`,
        }}
      />
    </div>
  );
}