'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import TeamActivityGraph from '@/components/TeamActivityGraph';

export default function TeamPage() {
  const { team } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/data/people_${team}.json`);
        if (!res.ok) throw new Error('Error al cargar los usuarios del equipo');
        const data = await res.json();
        setUsers(data);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [team]);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const fetchJson = async (filename: string) => {
          try {
            const res = await fetch(`/data/${filename}`);
            return res.ok ? await res.json() : [];
          } catch {
            return [];
          }
        };

        const allActivity = await Promise.all(
          users.map(async (user) => {
            const commits = await fetchJson(`commits_${user}.json`) || [];
            const prs = await fetchJson(`prs_${user}.json`) || [];
            const branches = await fetchJson(`branches_${user}.json`) || [];
            const tasks = await fetchJson(`tasks_${user}.json`) || [];
            return [...commits, ...prs, ...branches, ...tasks];
          })
        );

        const combinedData = allActivity.flat().filter(entry => entry.date || entry.updatedAt);

        console.log("📌 Datos sin procesar:", combinedData);

        // Agrupar actividad por fecha
        const activityByDate = combinedData.reduce((acc, entry) => {
          const rawDate = entry.date || entry.updatedAt;
          if (!rawDate) return acc;

          const parsedDate = rawDate.split('T')[0];
          console.log("📌 Fecha procesada:", parsedDate);

          acc[parsedDate] = (acc[parsedDate] || 0) + 1;
          return acc;
        }, {});

        console.log("📌 Agrupación por fecha:", activityByDate);

        // Convertir a formato para Recharts y ordenar por fecha
        const formattedData = Object.entries(activityByDate)
        .map(([date, count]) => ({
          date: date, // Aseguramos que sigue siendo string
          count: Number(count) || 0, // Convertimos count a número, evitando 'unknown'
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        console.log("📌 Datos formateados:", formattedData);
        setActivityData(formattedData);
      } catch (err) {
        console.error('Error al cargar la actividad del equipo:', err);
      }
    };
    
    if (users.length > 0) {
      (async () => {
        await fetchActivity();
      })();
    }
  }, [users]);

  if (loading) return <p className='text-center text-gray-500'>Cargando equipo...</p>;

  return (
    <div className='p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-semibold mb-4'>Equipo: {team}</h2>
      <h3 className='text-lg font-medium mb-2'>Usuarios en el equipo:</h3>
      <ul className='list-disc pl-5 mb-4'>
        {users.map(username => (
          <li key={username}>
            <a href={`/user/${username}`} className='text-blue-500 hover:underline'>
              {username}
            </a>
          </li>
        ))}
      </ul>
      <h3 className='text-lg font-medium mb-2'>Actividad del equipo:</h3>
      {activityData.length > 0 ? (
        <TeamActivityGraph activityData={activityData} startDate="2025-01-20" />
      ) : (
        <p className='text-center text-gray-500'>No hay actividad registrada.</p>
      )}
    </div>
  );
}
