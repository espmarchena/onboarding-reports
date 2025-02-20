'use client';
import { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, Tooltip } from 'recharts';
import { parseISO, format } from 'date-fns';

export default function CommitsGraph({ commits }) {
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    if (!commits || commits.length === 0) return;

    // Agrupar commits por fecha específica
    const commitsByDate = commits.reduce((acc, commit) => {
      const date = commit.date.split('T')[0]; // Obtener solo la parte de la fecha
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Convertir datos al formato de BarChart
    const formattedData = Object.entries(commitsByDate).map(([date, count]) => ({
      date,
      count,
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setBarData(formattedData);
  }, [commits]);

  return (
    <section className="mt-4 p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-semibold mb-4">Commits por Fecha</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={barData}>
          <XAxis dataKey="date" tickFormatter={(tick) => format(parseISO(tick), 'MMM dd')} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      <ul className="list-disc pl-5 mt-4">
        {commits.map((commit, index) => (
          <li key={index}>{commit.message} - {commit.date}</li>
        ))}
      </ul>
    </section>
  );
}
