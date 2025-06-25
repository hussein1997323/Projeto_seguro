import React, { useEffect, useState } from "react";
import { AxiosError } from "axios";
import makeRequest from "@/services/services";
import { formatarCPF, formatarCEP } from "@/utils/formatters";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VendaDetailModal, { IVenda } from "./VendaDetali";
import { MdOutlineModeEdit, MdDelete } from "react-icons/md";
import { IVendaPayload } from "@/types/vendaTypes";

export default function Vendas() {
  const [listaVindas, setListaVindas] = useState<IVenda[]>([]);
  const [selectedVenda, setSelectedVenda] = useState<IVenda | null>(null);
  const [cpfSearch, setCpfSearch] = useState("");
  const [client, setClient] = useState<{ id: number } | null>(null);
  const [errorClient, setErrorClient] = useState("");
  const [username, setUsername] = useState("");
  const [cpf, setCpf] = useState("");
  const [status, setStatus] = useState("");
  const [apolice, setApolice] = useState("");
  const [seguro, setSeguro] = useState("");
  const [produto, setProduto] = useState("");
  const [valor, setValor] = useState("");
  const [rua, setRua] = useState("");
  const [cidade, setCidade] = useState("");
  const [cpfFilter, setCpfFilter] = useState("");
  const [vendaInfo, setVendaInfo] = useState({
    placa: "",
    modelo: "",
    utilizacao: "",
    chassi: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    barrio: "",
    estado: "",
    pais: "",
    cooporativa: "",
    data_inicio: "",
    data_final: "",
  });

  // ───── Novos estados para edição ─────
  const [isEditing, setIsEditing] = useState(false);
  const [editVenda, setEditVenda] = useState<IVenda | null>(null);

  useEffect(() => {
    fetchVindas();
  }, []);

  const fetchVindas = async () => {
    try {
      const res = await makeRequest.get("/api/vindas/searchVenda");
      setListaVindas(res.data);
    } catch (error: unknown) {
      let msg = "Erro ao buscar vindas.";
      if (error instanceof AxiosError) {
        msg = error.response?.data?.msg || error.message;
      } else if (error instanceof Error) {
        msg = error.message;
      }
      console.error(msg);
    }
  };

  const buscarEndereco = async (cepLimpo: string) => {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setVendaInfo((prev) => ({
          ...prev,
          endereco: data.logradouro || "",
          estado: data.uf || "",
          barrio: data.bairro || "",
          pais: "Brasil",
        }));
      } else {
        setVendaInfo((prev) => ({
          ...prev,
          endereco: "",
          barrio: "",
          estado: "",
          pais: "",
        }));
      }
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
      setVendaInfo((prev) => ({
        ...prev,
        endereco: "",
        barrio: "",
        estado: "",
        pais: "",
      }));
    }
  };

  useEffect(() => {
    if (!vendaInfo.cep) return;
    const cepLimpo = vendaInfo.cep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      buscarEndereco(cepLimpo);
    }
  }, [vendaInfo.cep]);

  const handleBuscar = async () => {
    if (!cpfSearch) return;

    try {
      const res = await makeRequest.get("/api/vindas/search", {
        params: { cpf: cpfSearch },
      });
      setClient({ id: res.data.id });
      setErrorClient("");
      setUsername(res.data.username);
      setCpf(res.data.cpf);
      setStatus(res.data.status);
      setRua(res.data.rua);
      setCidade(res.data.cidade);
      setApolice(res.data.apolice || "");
      setCpfSearch("");
    } catch {
      toast.error("Cliente não encontrado", {
        position: "bottom-left",
        autoClose: 5000,
      });
    }
  };

  const resetFormFields = () => {
    setUsername("");
    setCpf("");
    setApolice("");
    setSeguro("");
    setProduto("");
    setValor("");
    setVendaInfo({
      placa: "",
      modelo: "",
      utilizacao: "",
      chassi: "",
      cep: "",
      endereco: "",
      numero: "",
      complemento: "",
      barrio: "",
      estado: "",
      pais: "",
      cooporativa: "",
      data_inicio: "",
      data_final: "",
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza de deletar esta venda?")) {
      return;
    }
    try {
      await makeRequest.post("/api/vindas/delete", { id });
      setListaVindas((prev) => prev.filter((venda) => venda.id !== id));
      toast.success("Venda deletada com sucesso");
    } catch (erro) {
      console.error("Erro ao deletar venda:", erro);
      toast.error("Erro ao deletar venda");
    }
  };

  // ───── handleSalvar agora cobre CRIAÇÃO e EDIÇÃO ─────
  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;

    const user = JSON.parse(
      localStorage.getItem("sistema-cadastro-keite:user") || "{}"
    );
    const vendedor = user?.username || "Desconhecido";

    // Monta o payload com todos os campos necessários
    const payload: IVendaPayload = {
      client_id: client.id,
      cpf,
      username,
      valor,
      vendedor,
      status,
      rua,
      cidade,
      apolice,
      seguro,
      produto,
      ...vendaInfo,
    };

    try {
      if (isEditing && editVenda) {
        // ─── MODO EDIÇÃO ───
        payload.id = editVenda.id;
        const res = await makeRequest.patch("/api/vindas/editar", payload);

        setListaVindas((prev) =>
          prev.map((v) => (v.id === editVenda.id ? res.data : v))
        );
        toast.success("Venda atualizada com sucesso");
      } else {
        // ─── MODO CRIAÇÃO ───
        const res = await makeRequest.post("/api/vindas/vendas", payload);

        const novaVenda: IVenda = {
          client_id: res.data.client_id, // ← pega só o número correto
          id: res.data.id,
          username: res.data.username,
          cpf: res.data.cpf,
          status: res.data.status,
          rua: res.data.rua,
          cidade: res.data.cidade,
          valor: res.data.valor,
          created_at: res.data.data_inicio || new Date().toISOString(),
          apolice: res.data.apolice,
          seguro: res.data.seguro,
          produto: res.data.produto,
          placa: vendaInfo.placa,
          modelo: vendaInfo.modelo,
          utilizacao: vendaInfo.utilizacao,
          chassi: vendaInfo.chassi,
          endereco: vendaInfo.endereco,
          cep: vendaInfo.cep,
          barrio: vendaInfo.barrio,
          numero: vendaInfo.numero,
          complemento: vendaInfo.complemento,
          estado: vendaInfo.estado,
          pais: vendaInfo.pais,
          cooporativa: vendaInfo.cooporativa,
          data_inicio: vendaInfo.data_inicio,
          data_final: vendaInfo.data_final,
        };

        setListaVindas((prev) => [...prev, novaVenda]);
        toast.success("Venda salva com sucesso");
      }

      // Fecha modal e reseta estado de edição
      setIsEditing(false);
      setEditVenda(null);
      setClient(null);
      resetFormFields();
    } catch (err: unknown) {
      let msg = isEditing ? "Erro ao atualizar venda" : "Erro ao salvar venda";

      if (err instanceof AxiosError) {
        msg = err.response?.data?.msg || err.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }

      console.error(msg, err);
      toast.error(msg);
    }
  };

  const tableFiltrada = listaVindas.filter((t) =>
    (t.cpf?.replace(/\D/g, "") || "").includes(cpfFilter.replace(/\D/g, ""))
  );
  return (
    <div className="p-6 w-full overflow-x-auto">
      {/* Busca Cliente para Nova Venda (ou Edição) */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="CPF do cliente"
          value={formatarCPF(cpfSearch)}
          onChange={(e) => setCpfSearch(e.target.value)}
          className="flex-1 border focus-visible:outline-none px-3 py-2 rounded"
        />
        <button
          onClick={handleBuscar}
          className="bg-sky-500 px-4 py-2 text-white rounded hover:bg-sky-600"
        >
          Buscar
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filtrar tabela por CPF"
          value={formatarCPF(cpfFilter)}
          onChange={(e) => setCpfFilter(e.target.value)}
          className="border w-1/3 px-3 py-2 rounded focus:outline-none"
        />
      </div>
      {errorClient && <p className="text-red-500">{errorClient}</p>}

      {/* Tabela de Vendas */}
      <div className="rounded-lg shadow mb-6 max-h-[80vh] overflow-y-auto">
        <table className="min-w-full table-auto">
          <thead className="sticky top-0 bg-gray-100 text-sm uppercase z-10">
            <tr>
              <th className="p-3 text-left">Cliente</th>
              <th className="p-3 text-left">CPF</th>
              <th className="p-3 text-left">Valor</th>
              <th className="p-3 text-left">Data</th>
              <th className="p-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {tableFiltrada.length > 0 ? (
              tableFiltrada.map((venda) => (
                <tr key={venda.id} className="hover:bg-gray-50">
                  <td
                    onClick={() => setSelectedVenda(venda)}
                    className="p-3 text-sky-600 hover:underline cursor-pointer"
                  >
                    {venda.username}
                  </td>
                  <td className="p-3">{formatarCPF(venda.cpf)}</td>
                  <td className="p-3">R$ {venda.valor}</td>
                  <td className="p-3">
                    {new Date(venda.created_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="p-3 space-x-2">
                    {/* Botão Deletar */}
                    <button
                      onClick={() => handleDelete(venda.id)}
                      className="text-red-500 hover:text-red-700 text-xl"
                      title="Remover"
                    >
                      <MdDelete />
                    </button>

                    {/* Botão Editar */}
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setEditVenda(venda);
                        setUsername(venda.username);
                        setCpf(venda.cpf);
                        setStatus(venda.status);
                        setRua(venda.rua);
                        setCidade(venda.cidade);
                        setApolice(venda.apolice);
                        setSeguro(venda.seguro);
                        setProduto(venda.produto);
                        setValor(venda.valor.toString());
                        setVendaInfo({
                          placa: venda.placa,
                          modelo: venda.modelo,
                          utilizacao: venda.utilizacao,
                          chassi: venda.chassi,
                          cep: venda.cep,
                          endereco: venda.endereco,
                          numero: venda.numero,
                          complemento: venda.complemento,
                          barrio: venda.barrio,
                          estado: venda.estado,
                          pais: venda.pais,
                          cooporativa: venda.cooporativa,
                          data_inicio: venda.data_inicio,
                          data_final: venda.data_final,
                        });
                        // ← Aqui: usar venda.client_id, não venda.id
                        setClient({ id: venda.client_id });
                      }}
                      className="text-blue-500 hover:text-blue-700 text-xl"
                      title="Editar"
                    >
                      <MdOutlineModeEdit />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  Nenhum usuário encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Nova Venda ou Edição */}
      {client && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <header className="flex justify-between items-center text-right">
              <h2 className="text-xl font-semibold">
                {isEditing ? "Editar Venda" : "Nova Venda"}
              </h2>
              <button
                onClick={() => {
                  setClient(null);
                  setIsEditing(false);
                  setEditVenda(null);
                  resetFormFields();
                }}
                className="text-gray-500 hover:text-gray-800 text-2xl text-left"
              >
                ×
              </button>
            </header>

            <form onSubmit={handleSalvar} className="space-y-5">
              {/* Nome */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border rounded px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-300"
                  required
                />
              </div>

              {/* CPF */}
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-1">CPF</label>
                <input
                  type="text"
                  maxLength={14}
                  value={formatarCPF(cpf)}
                  className="w-full border rounded px-3 py-2 bg-gray-100 focus:outline-none"
                  readOnly
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <input
                  type="text"
                  name="status"
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Rua
                </label>
                <input
                  type="text"
                  name="rua"
                  id="rua"
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cidade
                </label>
                <input
                  type="text"
                  name="cidade"
                  id="cidade"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>

              {/* Apólice */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Apólice
                </label>
                <input
                  type="text"
                  name="apolice"
                  id="apolice"
                  value={apolice}
                  onChange={(e) => setApolice(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>

              {/* Seguro */}
              <div className="w-full flex flex-col">
                <label className="block text-sm font-medium text-gray-700">
                  Seguro
                </label>
                <select
                  name="seguro"
                  value={seguro}
                  onChange={(e) => setSeguro(e.target.value)}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
                  required
                >
                  <option value="" disabled>
                    Selecione o seguro
                  </option>
                  <option value="Porto Seguros">Porto Seguros</option>
                  <option value="Azul Seguros">Azul Seguros</option>
                  <option value="Tokin Marine">Tokin Marine</option>
                  <option value="Allianz">Allianz</option>
                  <option value="Suhai">Suhai</option>
                  <option value="HDI">HDI</option>
                  <option value="Bradesco">Bradesco</option>
                  <option value="Mapfre">Mapfre</option>
                  <option value="SulAmarica">SulAmarica</option>
                  <option value="Sompo">Sompo</option>
                  <option value="American">American Life</option>
                  <option value="Sabemi">Sabemi</option>
                </select>
              </div>

              {/* Produto */}
              <div className="w-full flex flex-col">
                <label className="block text-sm font-medium text-gray-700">
                  Produto
                </label>
                <select
                  name="produto"
                  value={produto}
                  onChange={(e) => setProduto(e.target.value)}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
                  required
                >
                  <option value="" disabled>
                    Selecione o produto
                  </option>
                  <option value="Automóvel">Automóvel</option>
                  <option value="Residencial">Residencial</option>
                  <option value="VidaIndividual">Vida Individual</option>
                  <option value="Vida em grupo">Vida em grupo</option>
                  <option value="Rc">Rc ônibus</option>
                  <option value="Condomínio">Condomínio</option>
                  <option value="motofrete">Vida motofrete</option>
                  <option value="PetLove">PetLove</option>
                  <option value="Equipamentos">Equipamentos portáteis</option>
                  <option value="seguro Viagem">Seguro Viagem</option>
                  <option value="Locatícia">Fiança Locatícia</option>
                </select>

                {/* Campos dinâmicos para cada tipo de produto */}
                {produto === "Automóvel" && (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <input
                      className="border rounded px-3 py-2"
                      type="text"
                      placeholder="Placa"
                      value={vendaInfo.placa}
                      onChange={(e) =>
                        setVendaInfo((prev) => ({
                          ...prev,
                          placa: e.target.value,
                        }))
                      }
                      required
                    />
                    <input
                      className="border rounded px-3 py-2"
                      type="text"
                      placeholder="Modelo"
                      value={vendaInfo.modelo}
                      onChange={(e) =>
                        setVendaInfo((prev) => ({
                          ...prev,
                          modelo: e.target.value,
                        }))
                      }
                      required
                    />
                    <input
                      className="border rounded px-3 py-2 col-span-2"
                      type="text"
                      placeholder="Utilização"
                      value={vendaInfo.utilizacao}
                      onChange={(e) =>
                        setVendaInfo((prev) => ({
                          ...prev,
                          utilizacao: e.target.value,
                        }))
                      }
                    />
                    <input
                      className="border rounded px-3 py-2 col-span-2"
                      type="text"
                      placeholder="Chassi"
                      value={vendaInfo.chassi}
                      onChange={(e) =>
                        setVendaInfo((prev) => ({
                          ...prev,
                          chassi: e.target.value,
                        }))
                      }
                    />
                  </div>
                )}

                {produto === "Residencial" && (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <input
                      className="border rounded px-3 py-2 col-span-2"
                      type="text"
                      placeholder="CEP"
                      value={formatarCEP(vendaInfo.cep)}
                      onChange={(e) =>
                        setVendaInfo((prev) => ({
                          ...prev,
                          cep: e.target.value,
                        }))
                      }
                      required
                    />
                    <input
                      className="border rounded px-3 py-2 col-span-2"
                      type="text"
                      placeholder="Endereço"
                      value={vendaInfo.endereco || ""}
                      onChange={(e) =>
                        setVendaInfo((prev) => ({
                          ...prev,
                          endereco: e.target.value,
                        }))
                      }
                    />
                    <input
                      className="border rounded px-3 py-2"
                      type="text"
                      placeholder="Bairro"
                      value={vendaInfo.barrio}
                      onChange={(e) =>
                        setVendaInfo((prev) => ({
                          ...prev,
                          barrio: e.target.value,
                        }))
                      }
                    />
                    <input
                      className="border rounded px-3 py-2"
                      type="text"
                      placeholder="Número"
                      value={vendaInfo.numero}
                      onChange={(e) =>
                        setVendaInfo((prev) => ({
                          ...prev,
                          numero: e.target.value,
                        }))
                      }
                    />
                    <input
                      className="border rounded px-3 py-2"
                      type="text"
                      placeholder="Complemento"
                      value={vendaInfo.complemento}
                      onChange={(e) =>
                        setVendaInfo((prev) => ({
                          ...prev,
                          complemento: e.target.value,
                        }))
                      }
                    />
                    <input
                      className="border rounded px-3 py-2"
                      type="text"
                      placeholder="Estado"
                      value={vendaInfo.estado}
                      onChange={(e) =>
                        setVendaInfo((prev) => ({
                          ...prev,
                          estado: e.target.value,
                        }))
                      }
                    />
                    <input
                      className="border rounded px-3 py-2"
                      type="text"
                      placeholder="País"
                      value={vendaInfo.pais}
                      onChange={(e) =>
                        setVendaInfo((prev) => ({
                          ...prev,
                          pais: e.target.value,
                        }))
                      }
                    />
                  </div>
                )}

                {produto === "Rc" && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Cooperativa
                    </label>
                    <input
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
                      type="text"
                      placeholder="Cooperativa"
                      value={vendaInfo.cooporativa}
                      onChange={(e) =>
                        setVendaInfo((prev) => ({
                          ...prev,
                          cooporativa: e.target.value,
                        }))
                      }
                    />
                  </div>
                )}
              </div>

              {/* Datas */}
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col">
                  <label
                    htmlFor="inicio"
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    Início
                  </label>
                  <input
                    id="inicio"
                    type="date"
                    name="data_inicio"
                    value={vendaInfo.data_inicio}
                    onChange={(e) =>
                      setVendaInfo((prev) => ({
                        ...prev,
                        data_inicio: e.target.value,
                      }))
                    }
                    className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="final"
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    Final
                  </label>
                  <input
                    id="final"
                    type="date"
                    name="data_final"
                    value={vendaInfo.data_final}
                    onChange={(e) =>
                      setVendaInfo((prev) => ({
                        ...prev,
                        data_final: e.target.value,
                      }))
                    }
                    className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300"
                    required
                  />
                </div>
              </div>

              {/* Valor */}
              <div>
                <label className="block text-sm font-medium mb-1">Valor</label>
                <input
                  type="number"
                  step="0.01"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>

              {/* Botão Salvar ou Atualizar */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`${
                    isEditing
                      ? "bg-blue-600 hover:bg-blue-500"
                      : "bg-green-600 hover:bg-green-500"
                  } text-white px-4 py-2 rounded`}
                >
                  {isEditing ? "Atualizar" : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Detalhes da Venda */}
      {selectedVenda && (
        <VendaDetailModal
          post={selectedVenda}
          onClose={() => setSelectedVenda(null)}
        />
      )}

      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
