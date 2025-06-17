"use client";

import { useEffect, useState } from "react";
import ClientPost from "./ClientPost";
import makeRequest from "@/services/services";
import { IPost } from "@/types/postTypes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddClinetModal from "./AddClientModel";
import ClientDetailModal from "./ClientDetailModal";
import ProProtectedRoute from "./AdimPage";

export default function ClientPage() {
  const [clients, setClients] = useState<IPost[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [busca, setBusca] = useState("");
  const [selectedClient, setSelectedClient] = useState<IPost | null>(null);
  const [initialData, setInitialData] = useState<IPost | null>(null);
  // Quando o CEP mudar e tiver 8 números, busca o endereço

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const handleDelete = async (id: number) => {
    // Pergunta ao usuário se realmente quer deletar
    if (!window.confirm("Tem certeza que deseja deletar este usuário?")) return;

    try {
      const res = await makeRequest.post("/clientModel/delete", { id });
      toast.success("Usuário deletado com sucesso!");
      // Aqui você pode querer atualizar a lista de clientes para refletir a exclusão
    } catch (error) {
      toast.error("Erro ao deletar usuário");
      console.error(error);
    }
  };

  const handleEditClick = (client: IPost) => {
    setInitialData(client);
    setShowModal(true);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await makeRequest.get("/clientModel/clientes");
        setClients(res.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);
  const handleSaveClient = (saved: IPost) => {
    if (initialData) {
      // edição → substituir no array
      setClients((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
      toast.success("Cliente atualizado com sucesso!");
    } else {
      // criação → acrescentar na lista
      setClients((prev) => [...prev, saved]);
      toast.success("Cliente criado com sucesso!");
    }
    setShowModal(false);
    setInitialData(null);
  };

  const tableFilitrada = clients.filter(
    (t) =>
      (t.username || "").toLowerCase().includes(busca.toLowerCase()) ||
      (t.email || "").toLowerCase().includes(busca.toLowerCase()) ||
      (t.cpf || "").toString().includes(busca)
  );

  const toggleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === clients.length ? [] : clients.map((c) => c.id)
    );
  };

  return (
    <ProProtectedRoute allowLevels={["0", "1", "2"]}>
      <>
        <div className="p-6 w-full">
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Contatos</h1>
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar Cliente"
              className="border p-2 rounded px-16 focus:outline-none"
            />
            <button
              onClick={() => setShowModal(!showModal)}
              className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded"
            >
              ADICIONAR
            </button>
          </div>

          <table className="w-full border-collapse">
            <thead className="border-b">
              <tr>
                <th className="p-2">
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={selectedIds.length === clients.length}
                  />
                </th>
                <th className="p-2 text-left">Tipo</th>
                <th className="p-2 text-left">Nome</th>
                <th className="p-2 text-left">Telefone</th>
                <th className="p-2 text-left">Email</th>
                <th className="p">Status</th>
              </tr>
            </thead>
            <tbody>
              {tableFilitrada.length > 0 ? (
                tableFilitrada.map((post) => (
                  <ClientPost
                    key={post.id}
                    post={post}
                    isSelected={selectedIds.includes(post.id)}
                    onSelect={() => handleSelect(post.id)}
                    onShowDetails={() => setSelectedClient(post)}
                    onEdit={() => handleEditClick(post)}
                    onDelete={() => handleDelete(post.id)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <ToastContainer />
        </div>
        {showModal && (
          <AddClinetModal
            initialData={initialData}
            onClose={() => {
              setShowModal(false);
              setInitialData(null);
            }}
            onSave={handleSaveClient}
          />
        )}

        {selectedClient && (
          <ClientDetailModal
            post={selectedClient}
            onClose={() => setSelectedClient(null)}
          />
        )}
      </>
    </ProProtectedRoute>
  );
}
