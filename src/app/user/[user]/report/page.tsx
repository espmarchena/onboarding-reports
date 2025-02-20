"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import UserSummary from "@/components/UserSummary";
import UserActivityGraph from "@/components/UserActivityGraph";
import CommitsTable from "@/components/CommitsTable";
import PRsTable from "@/components/PRsTable";
import BranchesTable from "@/components/BranchesTable";
import RadarUser from "@/components/RadarUser";
import TasksDetails from "@/components/TasksDetails";
import AttendanceCalendar from "@/components/AttendanceCalendar";

export default function UserReport() {
  const params = useParams();
  const user = params.user;

  const [commits, setCommits] = useState([]);
  const [prs, setPRs] = useState([]);
  const [branches, setBranches] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [userType, setUserType] = useState<string | null>(null);
  const [userAttendance, setUserAttendance] = useState({});
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetch(`/data/commits_${user}.json`).then(res => res.json()).then(setCommits);
      fetch(`/data/prs_${user}.json`).then(res => res.json()).then(setPRs);
      fetch(`/data/branches_${user}.json`).then(res => res.json()).then(setBranches);
      fetch(`/data/tasks_${user}.json`).then(res => res.json()).then(setTasks);
    }
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [usersRes] = await Promise.all([
          fetch('/data/users.json'),
        ]);

        const users = await usersRes.json();
        
        const userData = users.find(u => u["Usuario de Github"] === user);
        if (userData) {
          setUserData(userData);
          setUserAttendance(userData.Asistencia || {});
          console.log(`Type: ${userData.Type}`);
          setUserType(userData.Type || 'devs');
        } else {
          setError("Usuario no encontrado");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) return <p className='text-center text-gray-500'>Cargando usuario...</p>;
  if (error) return <p className='text-center text-red-500'>{error}</p>;

  return (
    <div className="container mx-auto p-4 user-summary">
      <div id="user-profile">
        <h1 className="text-2xl font-bold">Actividad de {user}</h1>
        <UserSummary tasks={tasks} commits={commits} prs={prs} branches={branches} userAttendance={userAttendance} />
        <AttendanceCalendar userData={userData}  />
        <UserActivityGraph user={user} />
        {userType && <RadarUser user={user} userType={userType} />}
        <CommitsTable commits={commits} />
        <PRsTable prs={prs} />
        <BranchesTable branches={branches} />
        <TasksDetails tasks={tasks} allExpanded={true} />
      </div>
    </div>
  );
}
