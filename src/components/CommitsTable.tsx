export default function CommitsTable({ commits }) {
  return (
    <section className="mt-4">
      <h2 className="text-xl font-semibold">Commits</h2>
      <ul className="list-disc pl-5">
        {commits.map((commit, index) => (
          <li key={index}>{commit.message} - {commit.date}</li>
        ))}
      </ul>
    </section>
  );
}
