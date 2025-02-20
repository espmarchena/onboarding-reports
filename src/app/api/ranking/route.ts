import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    // Cargar usuarios desde `users.json`
    const usersPath = path.join(process.cwd(), "public/data/users.json");
    const usersData = await fs.readFile(usersPath, "utf-8");
    const users = JSON.parse(usersData);

    console.log("here");

    // Procesar puntuación de cada usuario
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const githubUser = user["Usuario de Github"];

        // Cargar datos de actividad desde JSONs
        const [commits, prs, branches, tasks] = await Promise.all([
          fs.readFile(path.join(process.cwd(), `public/data/commits_${githubUser}.json`), "utf-8").then(JSON.parse).catch(() => []),
          fs.readFile(path.join(process.cwd(), `public/data/prs_${githubUser}.json`), "utf-8").then(JSON.parse).catch(() => []),
          fs.readFile(path.join(process.cwd(), `public/data/branches_${githubUser}.json`), "utf-8").then(JSON.parse).catch(() => []),
          fs.readFile(path.join(process.cwd(), `public/data/tasks_${githubUser}.json`), "utf-8").then(JSON.parse).catch(() => []),
        ]);

        // Calcular puntuación total
        const taskScore = tasks.reduce((acc, task) => acc + (task.bodyHTML ? 3 : 1) + Math.floor((task.bodyHTML?.split(/\s+/).length || 0) / 20) + (task.bodyHTML?.match(/<img/g) || []).length, 0);
        const commitScore = commits.length * 5;
        const branchScore = branches.length * 20;
        const prScore = prs.length * 20;

        // Calcular asistencia
        const attendanceScore = Object.values(user.Asistencia || {}).filter(value => value).length * 10;

        // Puntuación total
        const totalScore = (taskScore + commitScore + branchScore + prScore + attendanceScore) / 20;

        return {
          githubUser,
          fullName: user["Nombre completo"],
          group: user["Grupo"],
          tutor: user["Correo del tutor/a"],
          city: user["Ciudad"],
          grade: user["Grado"],
          totalScore,
        };
      })
    );

    // Ordenar por puntuación
    enrichedUsers.sort((a, b) => b.totalScore - a.totalScore);

    // Guardar ranking en un JSON (para evitar cálculos cada vez)
    // const rankingPath = path.join(process.cwd(), "public/data/ranking.json");
    // await fs.writeFile(rankingPath, JSON.stringify(enrichedUsers, null, 2), "utf-8");

    return NextResponse.json(enrichedUsers);
  } catch (error) {
    console.error("Error generando ranking:", error);
    return NextResponse.json({ error: "Error al calcular ranking" }, { status: 500 });
  }
}
