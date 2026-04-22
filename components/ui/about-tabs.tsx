'use client';

import {
  Stepper,
  StepperNav,
  StepperItem,
  StepperTrigger,
  StepperContent,
} from '@/components/ui/stepper';
import TimeLine_01 from '@/components/ui/release-time-line';
import SoftwareGrowthChart from '@/components/ui/software-growth-chart';
import RotatingEarth from '@/components/ui/wireframe-dotted-globe';

export default function AboutTabs() {
  return (
    <div style={{ width: '100%' }}>
      <Stepper>
        <StepperNav>
          <StepperItem step={1}>
            <StepperTrigger step={1}>Sobre mim</StepperTrigger>
          </StepperItem>

          <StepperItem step={2}>
            <StepperTrigger step={2}>Trajetória</StepperTrigger>
          </StepperItem>

          <StepperItem step={3}>
            <StepperTrigger step={3}>Crescimento</StepperTrigger>
          </StepperItem>

          <StepperItem step={4}>
            <StepperTrigger step={4}>Futuro</StepperTrigger>
          </StepperItem>
        </StepperNav>

        <StepperContent step={1}>
          <div
            style={{
              maxWidth: '980px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '300px',
                height: '420px',
                borderRadius: '26px',
                overflow: 'hidden',
                background: '#1f1f23',
                boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <img
                src="/foto.png"
                alt="Foto"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  transition: 'transform 0.5s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
            </div>

            <div
              style={{
                marginLeft: '-30px',
                width: '620px',
                borderRadius: '24px',
                background: 'rgba(10,10,12,0.95)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(16px)',
                boxShadow:
                  '0 25px 70px rgba(0,0,0,0.6), 0 0 60px rgba(109,95,166,0.12)',
                padding: '22px 24px',
                zIndex: 2,
                position: 'relative',
                overflow: 'hidden',
                opacity: 0,
                transform: 'translateY(20px)',
                animation: 'fadeUp 0.8s ease forwards',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background:
                    'linear-gradient(120deg, transparent, rgba(255,255,255,0.06), transparent)',
                  animation: 'shine 4s infinite',
                }}
              />

              <h3
                style={{
                  fontSize: '30px',
                  marginBottom: '6px',
                  color: '#fff',
                  letterSpacing: '-0.03em',
                  fontWeight: 500,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                Gustavo Ferreira
              </h3>

              <p
                style={{
                  fontSize: '13px',
                  color: '#7f8fb8',
                  marginBottom: '12px',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                Engenharia de Software • IBMEC
              </p>

              <p
                style={{
                  fontSize: '14px',
                  color: '#e4e4e7',
                  lineHeight: 1.7,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                Me chamo Gustavo Zocharato Ferreira, tenho 18 anos e moro em Guarulhos.
                Atualmente curso Engenharia de Software no IBMEC com bolsa 100%.

                Sou apaixonado por tecnologia e tenho grande interesse pelo mercado
                financeiro, buscando evoluir e entender cada vez mais essas áreas.
              </p>
            </div>
          </div>
        </StepperContent>

        <StepperContent step={2}>
          <div
            style={{
              maxWidth: '1100px',
              margin: '0 auto',
            }}
          >
            <TimeLine_01 />
          </div>
        </StepperContent>

        <StepperContent step={3}>
          <SoftwareGrowthChart />
        </StepperContent>

        <StepperContent step={4}>
          <div
            style={{
              maxWidth: '1100px',
              margin: '0 auto',
              display: 'grid',
              gap: '22px',
            }}
          >
            <div
              style={{
                maxWidth: '760px',
                margin: '0 auto',
                textAlign: 'center',
              }}
            >
              <h3
                style={{
                  fontSize: '30px',
                  color: '#ffffff',
                  marginBottom: '12px',
                  letterSpacing: '-0.02em',
                }}
              >
                Meu futuro
              </h3>

              <p
                style={{
                  color: '#a1a1aa',
                  fontSize: '15px',
                  lineHeight: 1.85,
                }}
              >
                Atualmente estou em busca da minha primeira oportunidade de estágio na área de tecnologia. Acredito que essa experiência será fundamental para acelerar meu desenvolvimento profissional, permitindo aplicar na prática tudo o que venho aprendendo.

                Além disso, vejo o estágio como uma oportunidade de evoluir, ter contato com novas tecnologias e também desenvolver habilidades importantes, como o inglês, que é essencial no mercado de tecnologia.

                Meu objetivo é crescer constantemente, aprender com pessoas mais experientes e construir uma base sólida para minha carreira.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <RotatingEarth width={760} height={460} />
            </div>
          </div>
        </StepperContent>
      </Stepper>

      <style>
        {`
          @keyframes fadeUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes shine {
            0% { left: -100%; }
            100% { left: 120%; }
          }
        `}
      </style>
    </div>
  );
}