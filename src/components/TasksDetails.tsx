'use client';
import { useState } from 'react';

const calculateScore = (task) => {
  let score = task.bodyHTML ? 3 : 1; // 3 puntos si tiene descripción, 1 si no
  
  const wordCount = task.bodyHTML ? task.bodyHTML.split(/\s+/).length : 0;
  score += Math.floor(wordCount / 20); // 1 punto cada 20 palabras

  const imageCount = (task.bodyHTML.match(/<img/g) || []).length;
  score += imageCount; // 1 punto por cada imagen

  return score;
};

const processHTML = (html) => {
  if (!html) return "<p>Sin descripción</p>";

  //return html;
  return html.replace(/<img[^>]+src="([^"]+)"[^>]*>/g, (match, src) => {
    return `<img src="/api/proxy?url=${encodeURIComponent(src)}">`;
    //return `<p><a href="${src}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">🔗 Ver imagen en GitHub</a></p>`;
  });
};

export default function TasksDetails({ tasks, allExpanded = false}) {
  const [expandedTask, setExpandedTask] = useState(null);

  const totalScore = tasks.reduce((acc, task) => acc + calculateScore(task), 0);

  return (
    <section className="mt-4 p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-semibold mb-4">Detalles de Tareas</h2>
      <ul className="divide-y divide-gray-200">
        {tasks.map((task, index) => {
          const score = calculateScore(task);
          return (
            <li key={index} className="py-2">
              <button
                className="text-left w-full font-medium text-blue-600 hover:underline"
                onClick={() => setExpandedTask(expandedTask === index ? null : index)}
              >
                {task.title} - {score} puntos
              </button>
              { (allExpanded || expandedTask === index) && (
                <div className="mt-2 p-2 border-l-4 border-blue-400 bg-gray-100">
                  <p><strong>Fecha:</strong> {task.updatedAt || 'Desconocida'}</p>
                  <div className="mt-2 border-t pt-2" dangerouslySetInnerHTML={{ __html: processHTML(task.bodyHTML) }} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <h3 className="mt-4 text-lg font-semibold">Puntuación Total: {totalScore} puntos</h3>
    </section>
  );
}
