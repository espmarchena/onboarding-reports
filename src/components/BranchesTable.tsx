export default function BranchesTable({ branches }) {
  return (
    <section className="mt-4">
      <h2 className="text-xl font-semibold">Branches</h2>
      <ul className="list-disc pl-5">
        {branches.map((branch, index) => (
          <li key={index}>{branch.name} - {branch.repository}</li>
        ))}
      </ul>
    </section>
  );
}
