"use client";

import { useEffect, useState } from "react";
import { Users, UserCheck, DollarSign } from "lucide-react";
import makeRequest from "@/services/services";

interface Stats {
  totalUsers: number;
  totalClients: number;
  totalValue: number;
  totalAtivo: number;
  totalInativo: number;
  totalSemIdentidade: number;
  proximosVencimentos: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalClients: 0,
    totalValue: 0,
    totalAtivo: 0,
    totalInativo: 0,
    totalSemIdentidade: 0,
    proximosVencimentos: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await makeRequest.get("/dashboard/dashboard");
        const data = res.data.data ?? res.data; // pega o objeto real, independente da camada "data"

        setStats({
          totalUsers: Number(data.totalUsers ?? 0),
          totalClients: Number(data.totalClients ?? 0),
          totalValue: Number(data.totalValue ?? 0),
          totalAtivo: Number(data.totalAtivo ?? 0),
          totalInativo: Number(data.totalInativo ?? 0),
          totalSemIdentidade: Number(data.totalSemIdentidade ?? 0),
          proximosVencimentos: Number(data.proximosVencimentos ?? 0), // ⬅ aqui
        });
      } catch (err) {
        console.error("Erro ao buscar estatísticas:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-50 text-blue-900 p-6 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <p className="text-lg font-medium text-blue-700">Usuários</p>
            <p className="text-2xl md:text-3xl font-bold">{stats.totalUsers}</p>
          </div>
          <Users className="w-10 h-10 text-blue-500" />
        </div>

        <div className="bg-green-50 text-green-900 p-6 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <p className="text-lg font-medium text-green-700">Clientes</p>
            <p className="text-2xl md:text-3xl font-bold">
              {stats.totalClients}
            </p>
          </div>
          <UserCheck className="w-10 h-10 text-green-500" />
        </div>

        <div className="bg-red-50 text-red-900 p-6 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <p className="text-lg font-medium text-red-700">Vendas</p>
            <p className="text-2xl md:text-3xl font-bold">
              R${" "}
              {stats.totalValue.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <DollarSign className="w-10 h-10 text-red-500" />
        </div>

        <div className="bg-fuchsia-100 text-fuchsia-900 p-6 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <p className="text-lg font-medium text-fuchsia-700">
              Clientes próximos do vencimento
            </p>
            <p className="text-2xl md:text-3xl font-bold">
              {stats.proximosVencimentos}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
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
              <tr className="hover:bg-gray-50 even:bg-gray-50">
                <td className="py-3 px-6 text-green-600 font-medium">Ativo</td>
                <td className="py-3 px-6">{stats.totalAtivo}</td>
              </tr>
              <tr className="hover:bg-gray-50 even:bg-gray-50">
                <td className="py-3 px-6 text-red-600 font-medium">Inativo</td>
                <td className="py-3 px-6">{stats.totalInativo}</td>
              </tr>
              <tr className="hover:bg-gray-50 even:bg-gray-50">
                <td className="py-3 px-6 text-gray-500 font-medium">
                  Sem identidade
                </td>
                <td className="py-3 px-6">{stats.totalSemIdentidade}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center text-gray-400 italic">
          Informações adicionais em breve...
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
