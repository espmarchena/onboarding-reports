'use client';
import { useEffect, useState } from 'react';
import { ResponsiveContainer, ScatterChart, XAxis, YAxis, ZAxis, Scatter, Tooltip } from 'recharts';
import { parseISO, format, isAfter } from 'date-fns';

interface TeamActivityGraphProps {
  activityData: { date: string; count: number, updatedAt?: string }[];
  startDate?: string | null; // Permitir que sea string
}

export default function TeamActivityGraph({ activityData, startDate }: TeamActivityGraphProps) {
 
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    if (!activityData || activityData.length === 0) return;

    // Convertir startDate a objeto Date si está definido
    const startLimit = startDate ? parseISO(startDate) : null;

    // Agrupar actividad por fecha
    const activityByDate = activityData.reduce((acc, entry) => {
      const rawDate = entry.date?.split('T')[0] || entry.updatedAt?.split('T')[0];
      if (!rawDate) return acc;
      const parsedDate = parseISO(rawDate);
      
      // Filtrar si la fecha es anterior a startDate
      if (startLimit && !isAfter(parsedDate, startLimit)) return acc;
      
      acc[rawDate] = (acc[rawDate] || 0) + entry.count;
      return acc;
    }, {});

    // Convertir a formato para Recharts
    const formattedData = Object.entries(activityByDate)
      .map(([date, count]) => ({
        date: format(parseISO(date), 'yyyy-MM-dd'),
        count,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    console.log("📌 Datos procesados para Recharts:", formattedData);
    setGraphData(formattedData);
  }, [activityData, startDate]);

  return (
    <div className='mt-6 p-4 border rounded-lg shadow-lg bg-white'>
      <h2 className='text-xl font-semibold mb-4'>Actividad del Equipo</h2>
      <ResponsiveContainer width='100%' height={200}>
        <ScatterChart>
          <XAxis dataKey='date' type='category' tickFormatter={(tick) => format(parseISO(tick), 'MMM dd')} />
          <YAxis dataKey='count' type='number' name='Actividades' />
          <ZAxis dataKey='count' range={[10, 500]} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter data={graphData} fill='#8884d8' name='Actividad del equipo' />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
