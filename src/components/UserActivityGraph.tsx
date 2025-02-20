"use client";
import { useEffect, useState } from "react";
import { ResponsiveContainer, ScatterChart, XAxis, YAxis, ZAxis, Scatter, Tooltip } from "recharts";
import { parseISO, format } from "date-fns";

export default function ActivityGraph({ user }) {
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchJson = async (filename) => {
      try {
        const res = await fetch(`/data/${filename}`);
        return res.ok ? await res.json() : [];
      } catch {
        return [];
      }
    };

    const loadData = async () => {
      const commits = await fetchJson(`commits_${user}.json`);
      const prs = await fetchJson(`prs_${user}.json`);
      const branches = await fetchJson(`branches_${user}.json`);
      const tasks = await fetchJson(`tasks_${user}.json`);

      const combinedData = [...commits, ...prs, ...branches, ...tasks];

      // Agrupar actividad por fecha
      const activityByDate = combinedData.reduce((acc, entry) => {
        const date = entry.date?.split("T")[0] || entry.updatedAt?.split("T")[0];
        if (!date) return acc;
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      // Convertir a formato para Recharts y ordenar por fecha
      const formattedData = Object.entries(activityByDate)
        .map(([date, count]) => ({
          date: format(parseISO(date), "yyyy-MM-dd"), // Convertimos la fecha a string
          count,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setActivityData(formattedData);
    };

    loadData();
  }, [user]);

  return (
    <div className="mt-6 p-4 border rounded-lg shadow-lg bg-white user-activity">
      <h2 className="text-xl font-semibold mb-4">Actividad de {user}</h2>
      <ResponsiveContainer width="100%" height={200}>
        <ScatterChart>
          <XAxis dataKey="date" type="category" tickFormatter={(tick) => format(parseISO(tick), "MMM dd")} />
          <YAxis dataKey="count" type="number" name="Actividades" />
          <ZAxis dataKey="count" range={[10, 500]} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={activityData} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
