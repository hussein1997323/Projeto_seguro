"use client";

import { useEffect, useState } from "react";
import makeRequest from "@/services/services";
import { formatarCPF } from "@/utils/formatters";
import ProProtectedRoute from "./AdimPage";
import { MdDelete } from "react-icons/md";
import { AxiosError } from "axios";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface IPost {
  id: number;
  username: string;
  email: string;
  cpf: string;
  password: string;
  nivel: number;
  data_registro: Date;
}

function AddUser() {
  const [users, setUsers] = useState<IPost[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loggedUser, setLoggedUser] = useState<IPost | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [nivel, setNivel] = useState("0");
  let user = null;
  if (typeof window !== "undefined") {
    const savedUser = localStorage.getItem("sistema-cadastro-keite:user");
    user = savedUser ? JSON.parse(savedUser) : null;
  }
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("sistema-cadastro-keite:user");
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;

      if (!parsedUser) {
        window.location.href = "/login";
        return;
      }

      if (parsedUser.nivel === "0") {
        window.location.href = "/";
        return;
      }

      setLoggedUser(parsedUser);
    }
  }, []);

  const handelDelete = async (id: number) => {
    if (!loggedUser) {
      toast.error("Usuário não autenticado.");
      return;
    }

    if (id === loggedUser.id) {
      toast.error("Você não pode deletar a si mesmo.");
      return;
    }

    const confirm = window.confirm(
      "Tem certeza de que deseja deletar este usuário?"
    );

    if (!confirm) return;

    try {
      await makeRequest.post("/auth/delete", { id });
      toast.success("Usuário deletado com sucesso!");
      fetchUsers();
    } catch (error) {
      toast.error("Erro ao deletar usuário");
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await makeRequest.get("/auth/search");
      setUsers(res.data);
    } catch (error: unknown) {
      let msg = "Erro ao buscar usuários.";

      if (error instanceof AxiosError) {
        msg = error.response?.data?.msg || error.message;
      } else if (error instanceof Error) {
        msg = error.message;
      }

      console.error("Erro ao buscar usuários:", msg);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCloseModal = () => {
    clearForm();
    setShowModal(false);
  };

  const clearForm = () => {
    setUsername("");
    setEmail("");
    setCpf("");
    setPassword("");
    setConfirmPassword("");
    setNivel("0");
    setErrorMsg("");
  };

  const salvarUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      const res = await makeRequest.post("/auth/register", {
        username,
        email,
        cpf,
        nivel,
        password,
        confirmPassword,
      });

      toast.success(res.data.msg || "Usuário salvo com sucesso!");
      clearForm();
      setShowModal(false);
      fetchUsers();
    } catch (error: unknown) {
      let msg = "Erro ao salvar usuário. Tente novamente.";

      if (error instanceof AxiosError) {
        msg = error.response?.data?.msg || msg;
      } else if (error instanceof Error) {
        msg = error.message || msg;
      }

      setErrorMsg(msg);
      toast.error(msg);
    }
  };
  return (
    <ProProtectedRoute allowLevels={["1", "2"]}>
      <div className="p-6 w-full overflow-x-auto border-b">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-md font-medium shadow"
          >
            Adicionar
          </button>
        </div>

        <table className="min-w-full table-auto">
          <thead className="border-b">
            <tr className="font-bold text-sm uppercase">
              <th className="px-4 py-3 border-b text-left">Nome</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">CPF</th>
              <th className="px-4 py-3 text-left">Nivel</th>
              <th className="px-4 py-3 text-left">Data</th>
              <th className="px-4 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-b">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-left whitespace-nowrap border-b">
                  {u.username}
                </td>
                <td className="px-4 py-2 text-left break-all border-b">
                  {u.email}
                </td>
                <td className="px-4 py-2 text-left border-b">{u.cpf}</td>
                <td className="px-4 py-2 text-left border-b">{u.nivel}</td>
                <td className="px-4 py-2 text-left border-b">
                  {new Date(u.data_registro).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-2 text-center space-x-2 border-b">
                  <button
                    type="button"
                    className="text-sky-500 hover:text-red-800 font-bold text-2xl"
                    title="Excluir"
                    aria-label="Excluir"
                    onClick={() => handelDelete(u.id)}
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <header className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Novo Usuário</h2>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-red-500 text-2xl font-bold"
                  aria-label="Fechar"
                >
                  <IoIosCloseCircleOutline />
                </button>
              </header>

              <form onSubmit={salvarUser} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    className="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    className="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPF
                  </label>
                  <input
                    className="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="text"
                    maxLength={14}
                    value={formatarCPF(cpf)}
                    onChange={(e) => setCpf(e.target.value)}
                    required
                  />
                </div>

                {user.nivel === "2" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nível de Acesso
                    </label>
                    <select
                      className="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={nivel}
                      onChange={(e) => setNivel(e.target.value)}
                    >
                      <option value="0">Selecione</option>
                      <option value="0">Usuário</option>
                      <option value="1">Moderador</option>
                      <option value="2">Administrador</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha
                  </label>
                  <input
                    className="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Senha
                  </label>
                  <input
                    className="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {errorMsg && (
                  <p className="text-red-500 text-sm mt-2 font-medium">
                    {errorMsg}
                  </p>
                )}

                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md font-semibold shadow transition"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </ProProtectedRoute>
  );
}

export default AddUser;
