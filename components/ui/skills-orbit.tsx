'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ElementType } from 'react';
import {
  Code2,
  Braces,
  Database,
  FileCode2,
  BarChart3,
  Cpu,
  BarChart4,
  Code,
} from 'lucide-react';

type Skill = {
  id: number;
  name: string;
  level: number;
  shortLevel: string;
  description: string;
  color: string;
  icon: ElementType;
};

const skills: Skill[] = [
  {
    id: 1,
    name: 'Python',
    level: 90,
    shortLevel: 'Avançado',
    description: 'Uso Python para estudos, lógica, automações e projetos voltados para dados.',
    color: '#facc15',
    icon: Cpu,
  },
  {
    id: 2,
    name: 'JavaScript',
    level: 65,
    shortLevel: 'Intermediário',
    description: 'Uso JavaScript no desenvolvimento web e interações no front-end.',
    color: '#60a5fa',
    icon: FileCode2,
  },
  {
    id: 3,
    name: 'HTML',
    level: 85,
    shortLevel: 'Avançado',
    description: 'Estruturação de páginas, formulários e sites.',
    color: '#fb7185',
    icon: Braces,
  },
  {
    id: 4,
    name: 'CSS',
    level: 80,
    shortLevel: 'Avançado',
    description: 'Estilização, layout e responsividade.',
    color: '#34d399',
    icon: Code2,
  },
  {
    id: 5,
    name: 'Power BI',
    level: 80,
    shortLevel: 'Avançado',
    description: 'Dashboards e visualização de dados.',
    color: '#c084fc',
    icon: BarChart3,
  },
  {
    id: 6,
    name: 'SQL',
    level: 50,
    shortLevel: 'Intermediário',
    description: 'Consultas e manipulação de banco de dados.',
    color: '#f97316',
    icon: Database,
  },
  {
    id: 7,
    name: 'SAP',
    level: 55,
    shortLevel: 'Avançado',
    description: 'Consulta e extração de dados.',
    color: '#38bdf8',
    icon: Code2,
  },
  {
    id: 8,
    name: 'Excel',
    level: 90,
    shortLevel: 'Avançado',
    description: 'Análise de dados, planilhas e relatórios.',
    color: '#22c55e',
    icon: BarChart4,
  },
  {
    id: 9,
    name: 'C',
    level: 65,
    shortLevel: 'Intermediário',
    description: 'Desenvolver de problemas complexos.',
    color: '#3b82f6',
    icon: Code,
  },
  {
    id: 10,
    name: 'Node.js',
    level: 30,
    shortLevel: 'Básico',
    description: 'Execução de JavaScript fora do navegador e ambiente Next.js.',
    color: '#84cc16',
    icon: Braces,
  },
];

export default function SkillsOrbit() {
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const radius = 280;

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isRotating) {
      intervalRef.current = setInterval(() => {
        setRotation((prev) => prev + 0.2);
      }, 20);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRotating]);

  const positionedSkills = useMemo(() => {
    return skills.map((skill, index) => {
      const angle = (index / skills.length) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      return { ...skill, x, y };
    });
  }, []);

  return (
    <div
      onClick={() => {
        setActiveSkill(null);
        setIsRotating(true);
      }}
      style={{
        width: '100%',
        maxWidth: '1180px',
        margin: '0 auto',
        minHeight: '860px',
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        gap: '32px',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          minHeight: '640px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '620px',
            height: '620px',
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 0 120px rgba(124, 58, 237, 0.08)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            fontSize: '26px',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#c4b5fd',
            textShadow: '0 0 24px rgba(168,85,247,0.28)',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          Skills
        </div>

        {positionedSkills.map((skill) => {
          const Icon = skill.icon;
          const isActive = activeSkill?.id === skill.id;

          const baseAngle = Math.atan2(skill.y, skill.x);
          const currentAngle = baseAngle + (rotation * Math.PI) / 180;
          const orbitX = Math.cos(currentAngle) * radius;
          const orbitY = Math.sin(currentAngle) * radius;

          return (
            <button
              key={skill.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveSkill(skill);
                setIsRotating(false);
              }}
              style={{
                position: 'absolute',
                transform: `translate(${orbitX}px, ${orbitY}px)`,
                width: isActive ? '90px' : '74px',
                height: isActive ? '90px' : '74px',
                borderRadius: '999px',
                border: isActive
                  ? '1px solid rgba(255,255,255,0.45)'
                  : '1px solid rgba(255,255,255,0.12)',
                background: isActive
                  ? 'rgba(255,255,255,0.16)'
                  : 'rgba(20,20,24,0.82)',
                backdropFilter: 'blur(12px)',
                color: '#fff',
                cursor: 'pointer',
                transition: '0.25s ease',
                boxShadow: isActive
                  ? `0 0 30px ${skill.color}55`
                  : '0 10px 30px rgba(0,0,0,0.28)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px',
              }}
            >
              <Icon size={18} />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                {skill.name}
              </span>
            </button>
          );
        })}
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(18,18,24,0.72)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '28px',
          backdropFilter: 'blur(14px)',
          padding: '28px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        }}
      >
        <p
          style={{
            color: '#c7d2fe',
            fontSize: '13px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          Habilidade selecionada
        </p>

        <h3
          style={{
            fontSize: '34px',
            color: '#fff',
            marginBottom: '10px',
          }}
        >
          {activeSkill ? activeSkill.name : 'Skills'}
        </h3>

        <p
          style={{
            fontSize: '15px',
            color: '#a1a1aa',
            marginBottom: '22px',
          }}
        >
          {activeSkill ? `Nível: ${activeSkill.shortLevel}` : 'Clique em uma habilidade para ver os detalhes.'}
        </p>

        <div style={{ marginBottom: '10px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '13px',
              color: '#d4d4d8',
              marginBottom: '8px',
            }}
          >
            <span>Proficiência</span>
            <span>{activeSkill ? `${activeSkill.level}%` : '--'}</span>
          </div>

          <div
            style={{
              width: '100%',
              height: '10px',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: activeSkill ? `${activeSkill.level}%` : '0%',
                height: '100%',
                borderRadius: '999px',
                background: activeSkill
                  ? `linear-gradient(90deg, ${activeSkill.color}, #ffffff)`
                  : 'transparent',
                boxShadow: activeSkill
                  ? `0 0 18px ${activeSkill.color}66`
                  : 'none',
                transition: '0.35s ease',
              }}
            />
          </div>
        </div>

        <p
          style={{
            marginTop: '22px',
            fontSize: '16px',
            lineHeight: 1.75,
            color: '#d4d4d8',
          }}
        >
          {activeSkill
            ? activeSkill.description
            : 'Clique em uma skill para parar a rotação. Clique na área vazia ao redor para voltar a girar.'}
        </p>
      </div>
    </div>
  );
}