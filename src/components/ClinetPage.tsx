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
  const [statusFilter, setStatusFilter] = useState("todos"); // Novo estado para o filtro de status

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja deletar este usuário?")) return;

    try {
      await makeRequest.post("/api/clientModel/delete", { id });
      toast.success("Usuário deletado com sucesso!");
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
        const res = await makeRequest.get("/api/clientModel/clientes");
        setClients(res.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleSaveClient = (saved: IPost) => {
    if (initialData) {
      setClients((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
      toast.success("Cliente atualizado com sucesso!");
    } else {
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

  // Filtrando por status
  const filteredClients = tableFilitrada.filter((client) => {
    if (statusFilter === "todos") return true;
    if (statusFilter === "ativo") return client.status === "ativo";
    if (statusFilter === "inativo") return client.status === "inativo";
    return client.status === ""; // Para "sem identidade"
  });

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

          {/* Filtro de Status */}
          <div className="mb-4">
            <label htmlFor="statusFilter" className="mr-2">
              Filtrar por Status:
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="todos">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="semIdentidade">Sem Identidade</option>
            </select>
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
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length > 0 ? (
                filteredClients.map((post) => (
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
                  <td colSpan={6} className="p-4 text-center">
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
