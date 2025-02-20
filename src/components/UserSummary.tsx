"use client";
import { useEffect, useState } from "react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from "recharts";
import { CheckCircle, GitCommit, GitBranch, GitPullRequest, CalendarCheck } from "lucide-react";

const calculateTaskScore = (task) => {
  let score = task.bodyHTML ? 3 : 1;
  const wordCount = task.bodyHTML ? task.bodyHTML.split(/\s+/).length : 0;
  score += Math.floor(wordCount / 20);
  const imageCount = (task.bodyHTML.match(/<img/g) || []).length;
  score += imageCount;
  return score;
};

export default function UserSummary({ tasks, commits, branches, prs, userAttendance }) {
  const [totalScore, setTotalScore] = useState(0);
  const [scorePercentage, setScorePercentage] = useState(0);

  useEffect(() => {
    const taskScore = tasks.reduce((acc, task) => acc + calculateTaskScore(task), 0);
    const commitScore = commits.length * 5;
    const branchScore = branches.length * 20;
    const prScore = prs.length * 20;
    
    // Calcular puntos por asistencia (10 puntos por cada día con asistencia `true`)
    const attendanceScore = Object.values(userAttendance || {}).filter(value => value).length * 10;

    const total = taskScore + commitScore + branchScore + prScore + attendanceScore;
    setTotalScore(total);
    setScorePercentage((total / 200) * 10);
  }, [tasks, commits, branches, prs, userAttendance]);

  const radarData = [
    { category: 'Tareas', value: tasks.length },
    { category: 'Commits', value: commits.length },
    { category: 'Ramas', value: branches.length },
    { category: 'PRs', value: prs.length },
    { category: 'Asistencia', value: Object.values(userAttendance || {}).filter(value => value).length },
  ];

  return (
    <section className="mt-6 p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-semibold mb-4">Resumen de Actividad</h2>
      
      <p><strong>Puntuación Total:</strong> {totalScore} puntos</p>
      <p><strong>Calificación Equivalente:</strong> {scorePercentage.toFixed(2)} / 10</p>
      
      <div className="relative w-full bg-gray-300 rounded-full h-5 overflow-hidden mt-4">
        <div className="bg-blue-600 h-5 transition-all" style={{ width: `${Math.min(scorePercentage * 10, 100)}%` }}></div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="p-4 border rounded-lg shadow-md bg-white flex items-center">
          <CheckCircle className="text-green-500 mr-2" size={24} />
          <p><strong>Tareas:</strong> {tasks.length}</p>
        </div>
        <div className="p-4 border rounded-lg shadow-md bg-white flex items-center">
          <GitCommit className="text-blue-500 mr-2" size={24} />
          <p><strong>Commits:</strong> {commits.length}</p>
        </div>
        <div className="p-4 border rounded-lg shadow-md bg-white flex items-center">
          <GitBranch className="text-purple-500 mr-2" size={24} />
          <p><strong>Ramas:</strong> {branches.length}</p>
        </div>
        <div className="p-4 border rounded-lg shadow-md bg-white flex items-center">
          <GitPullRequest className="text-yellow-500 mr-2" size={24} />
          <p><strong>PRs:</strong> {prs.length}</p>
        </div>
        <div className="p-4 border rounded-lg shadow-md bg-white flex items-center">
          <CalendarCheck className="text-green-600 mr-2" size={24} />
          <p><strong>Dailies asistidos:</strong> {Object.values(userAttendance || {}).filter(value => value).length}</p>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold user-summary">Distribución de Actividad</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart outerRadius={90} data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" />
            <PolarRadiusAxis angle={30} domain={[0, Math.max(...radarData.map(d => d.value))]} />
            <Tooltip />
            <Radar name="Progreso" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
