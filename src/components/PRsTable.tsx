export default function PRsTable({ prs }) {
  return (
    <section className="mt-4">
      <h2 className="text-xl font-semibold">Pull Requests</h2>
      <ul className="list-disc pl-5">
        {prs.map((pr, index) => (
          <li key={index}>{pr.title} - {pr.state}</li>
        ))}
      </ul>
    </section>
  );
}
