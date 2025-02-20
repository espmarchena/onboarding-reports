export async function getUserData(user) {
  const fetchJson = async (filename) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/data/${filename}`);
      return res.ok ? res.json() : [];
    } catch {
      return [];
    }
  };

  const commits = await fetchJson(`commits_${user}.json`);
  const prs = await fetchJson(`prs_${user}.json`);
  const branches = await fetchJson(`branches_${user}.json`);
  const tasks = await fetchJson(`tasks_${user}.json`);

  return { commits, prs, branches, tasks };
}
