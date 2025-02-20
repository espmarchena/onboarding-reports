'use client';
import { useEffect, useState } from 'react';

export default function UsersTable() {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 50;

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch('/data/teams.json');
        if (!res.ok) throw new Error('Error al cargar los equipos');
        const data = await res.json();
        setTeams(data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await Promise.all(
          teams.map(team => fetch(`/data/people_${team.slug}.json`).then(res => res.json()))
        );
        
        const allUsers = {};
        teams.forEach((team, i) => {
          res[i].forEach(username => {
            if (!allUsers[username]) {
              allUsers[username] = { username, teams: [] };
            }
            allUsers[username].teams.push(team.name);
          });
        });
        
        const usersArray = Object.values(allUsers);
        setUsers(usersArray);
        setFilteredUsers(usersArray);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    if (teams.length > 0) fetchAllUsers();
  }, [teams]);

  useEffect(() => {
    let filtered = users;
    if (selectedTeam) {
      filtered = filtered.filter(user => user.teams.includes(selectedTeam));
    }
    if (search) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [selectedTeam, search, users]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className='p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-xl font-semibold mb-4'>Usuarios</h2>
      <div className='flex gap-4 mb-4'>
        <input
          type='text'
          placeholder='Buscar usuario...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='border p-2 rounded w-1/2'
        />
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className='border p-2 rounded w-1/2'
        >
          <option value=''>Todos los equipos</option>
          {teams.map(team => (
            <option key={team.slug} value={team.name}>{team.name}</option>
          ))}
        </select>
      </div>
      <table className='w-full border-collapse border border-gray-200'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border p-2'>Usuario</th>
            <th className='border p-2'>Equipos</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map(user => (
            <tr key={user.username} className='border'>
              <td className='border p-2'>
                <a href={`/user/${user.username}`} className='text-blue-500 hover:underline'>
                  {user.username}
                </a>
              </td>
              <td className='border p-2'>
                {user.teams.map(team => (
                  <a key={team} href={`/team/${team}`} className='text-blue-500 hover:underline mx-1'>
                    {team}
                  </a>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex justify-center mt-4'>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 mx-1 rounded ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
