'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';

const chartData = [
  { year: '2021', empregos: 1364180 },
  { year: '2022', empregos: 1468350 },
  { year: '2023', empregos: 1656880 },
];

function formatNumber(value: number) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export default function SoftwareGrowthChart() {
  return (
    <div
      style={{
        maxWidth: '980px',
        margin: '0 auto',
        padding: '28px',
        borderRadius: '24px',
        background: 'rgba(24,24,27,0.72)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
      }}
    >
      <div
        style={{
          marginBottom: '22px',
          textAlign: 'center',
        }}
      >
        <h3
          style={{
            fontSize: '28px',
            color: '#ffffff',
            marginBottom: '10px',
          }}
        >
          Crescimento da Engenharia de Software
        </h3>

        <p
          style={{
            color: '#a1a1aa',
            fontSize: '15px',
            lineHeight: 1.8,
            maxWidth: '760px',
            margin: '0 auto',
          }}
        >
          Histórico real de empregos para Software Developers nos Estados Unidos
          e projeção oficial de crescimento para a próxima década.
        </p>
      </div>

      <div
        style={{
          width: '100%',
          height: '360px',
          marginBottom: '20px',
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid
              stroke="rgba(255,255,255,0.08)"
              vertical={false}
            />

            <XAxis
              dataKey="year"
              tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={78}
              tickFormatter={(value) => `${(Number(value) / 1000000).toFixed(1)}M`}
              domain={[1300000, 1700000]}
            />

            <Tooltip
              contentStyle={{
                background: 'rgba(10,10,12,0.96)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px',
                color: '#fff',
              }}
              labelStyle={{ color: '#fff' }}
              formatter={(value) => [formatNumber(Number(value)), 'Empregos']}
            />

            <ReferenceLine
              y={1656880}
              stroke="rgba(255,255,255,0.12)"
              strokeDasharray="4 4"
            />

            <defs>
              <linearGradient id="softwareGrowthLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.95} />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#ec4899" stopOpacity={0.95} />
              </linearGradient>

              <filter
                id="softwareGrowthGlow"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <Line
              type="monotone"
              dataKey="empregos"
              stroke="url(#softwareGrowthLine)"
              strokeWidth={3}
              dot={{ r: 4, fill: '#ffffff' }}
              activeDot={{ r: 6 }}
              filter="url(#softwareGrowthGlow)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '14px',
        }}
      >
        <div
          style={{
            borderRadius: '18px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            padding: '16px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#a1a1aa',
              marginBottom: '6px',
            }}
          >
            Empregos em 2023
          </div>
          <div
            style={{
              fontSize: '30px',
              fontWeight: 700,
              color: '#ffffff',
            }}
          >
            1,66M
          </div>
        </div>

        <div
          style={{
            borderRadius: '18px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            padding: '16px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#a1a1aa',
              marginBottom: '6px',
            }}
          >
            Crescimento projetado
          </div>
          <div
            style={{
              fontSize: '30px',
              fontWeight: 700,
              color: '#ffffff',
            }}
          >
            +15%
          </div>
        </div>

        <div
          style={{
            borderRadius: '18px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            padding: '16px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#a1a1aa',
              marginBottom: '6px',
            }}
          >
            Leitura
          </div>
          <div
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#ffffff',
              lineHeight: 1.5,
            }}
          >
            Área em expansão e acima da média
          </div>
        </div>
      </div>
    </div>
  );
}