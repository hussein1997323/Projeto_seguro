"use client";

import { useEffect, useState } from "react";
import { Users, UserCheck, DollarSign } from "lucide-react"; // opcional
import makeRequest from "@/services/services";

function Deshbord() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClients: 0,
    totalValue: 0,
    totalAtivo: 0,
    totalInativo: 0,
    totalSemIdentidade: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await makeRequest.get("/dashboard/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error("Erro ao buscar estatísticas:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-100 text-blue-800 p-6 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-xl font-semibold">Usuários</p>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>
          <Users className="w-10 h-10" />
        </div>

        <div className="bg-green-100 text-green-800 p-6 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-xl font-semibold">Clientes</p>
            <p className="text-3xl font-bold">{stats.totalClients}</p>
          </div>
          <UserCheck className="w-10 h-10" />
        </div>

        <div className="bg-red-100 text-red-800 p-6 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-xl font-semibold">Vendas</p>
            <p className="text-3xl font-bold">
              R$ {Number(stats.totalValue).toFixed(2)}
            </p>
          </div>
          <DollarSign className="w-10 h-10" />
        </div>
      </div>

      {/* Status Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-6 font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-left py-3 px-6 font-semibold text-gray-600">
                  Quantidade
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-6 text-green-600 font-medium">Ativo</td>
                <td className="py-3 px-6">{stats.totalAtivo}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-6 text-red-600 font-medium">Inativo</td>
                <td className="py-3 px-6">{stats.totalInativo}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-6 text-gray-500 font-medium">
                  Sem identidade
                </td>
                <td className="py-3 px-6">{stats.totalSemIdentidade}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center text-gray-400">
          {/* Espaço para gráfico futuro ou informação complementar */}
          <p className="italic">Informações adicionais em breve...</p>
        </div>
      </div>
    </div>
  );
}

export default Deshbord;
