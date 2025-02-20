export default function TasksList({ tasks }) {
  return (
    <section className="mt-4">
      <h2 className="text-xl font-semibold">Tareas Completadas</h2>
      <ul className="list-disc pl-5">
        {tasks.map((task, index) => (
          <li key={index}>{task.title} - {task.updatedAt}</li>
        ))}
      </ul>
    </section>
  );
}
