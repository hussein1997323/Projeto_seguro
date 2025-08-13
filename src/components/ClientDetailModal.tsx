import React, { useEffect, useState } from "react";
import makeRequest from "@/services/services";
import { IPost } from "../types/postTypes";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface Props {
  post: IPost;
  onClose: () => void;
}

// Tupla para abas
const tabs = ["Informações", "Documentos"] as const;
type Tab = (typeof tabs)[number];

// Tipo cru do servidor
interface RawDocument {
  id: number;
  origem: string;
  titulo: string;
  responsavel: string;
  nome_arquivo: string;
  criado_em: string;
}

// Tipo usado no componente
interface DocumentItem {
  id: number;
  origem: string;
  title: string;
  responsavel: string;
  arquivoNome: string;
  criadoEm: string;
}

export default function ClientDetailModal({ post, onClose }: Props) {
  const [selectedTab, setSelectedTab] = useState<Tab>(tabs[0]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [newDoc, setNewDoc] = useState<{
    origem: string;
    title: string;
    responsavel: string;
    arquivo: File | null;
  }>({
    origem: "",
    title: "",
    responsavel: "",
    arquivo: null,
  });

  const [apolice, setApolice] = useState("");
  const [seguradora, setSeguradora] = useState("");
  const [produto, setProduto] = useState("");
  const [placa, setPlaca] = useState("");
  const [utilizacao, setUtilizacao] = useState("");
  const [modelo, setModelo] = useState("");
  const [data_inicial, setDatainicial] = useState("");
  const [data_final, setDatafinal] = useState("");

  const limparCampos = () => {
    setApolice("");
    setSeguradora("");
    setProduto("");
    setPlaca("");
    setUtilizacao("");
    setModelo("");
    setDatainicial("");
    setDatafinal("");
  };

  const handleBuscar = async () => {
    try {
      const res = await makeRequest.get(`/api/clientModel/vindaSearch`, {
        params: { client_id: post.id },
      });

      // pega o primeiro item do array
      if (res.data.length > 0) {
        const data = res.data[res.data.length - 1];
        setApolice(data.apolice);
        setSeguradora(data.seguro);
        setProduto(data.produto);
        setPlaca(data.placa);
        setUtilizacao(data.utilizacao);
        setModelo(data.modelo);
        setDatainicial(data.data_inicio);
        setDatafinal(data.data_final);
      } else {
        limparCampos();
      }
    } catch (error) {
      console.log("Erro ao buscar as informações", error);
    }
  };
  useEffect(() => {
    if (selectedTab === "Informações") {
      handleBuscar();
    }
  }, [selectedTab, post.id]);

  // Carrega documentos ao selecionar a aba
  useEffect(() => {
    if (selectedTab === "Documentos") {
      (async () => {
        const res = await makeRequest.get<RawDocument[]>(
          `/api/documentos/cliente/${post.id}`
        );
        setDocuments(
          res.data.map((doc) => ({
            id: doc.id,
            origem: doc.origem,
            title: doc.titulo,
            responsavel: doc.responsavel,
            arquivoNome: doc.nome_arquivo,
            criadoEm: new Date(doc.criado_em).toLocaleDateString("pt-BR"),
          }))
        );
      })();
    }
  }, [selectedTab, post.id]);

  const handleAddDocument = async () => {
    if (!newDoc.title || !newDoc.responsavel || !newDoc.arquivo) return;
    const formData = new FormData();
    formData.append("cliente_id", String(post.id));
    formData.append("titulo", newDoc.title);
    formData.append("origem", newDoc.origem || "Interno");
    formData.append("responsavel", newDoc.responsavel);
    formData.append("arquivo", newDoc.arquivo);

    await makeRequest.post("/api/documentos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setNewDoc({ origem: "", title: "", responsavel: "", arquivo: null });
    setSelectedTab("Documentos");
  };

  const detailFields = [
    { label: "CPF", value: post.cpf },
    { label: "Email", value: post.email },
    { label: "RG", value: post.rg },
    { label: "CNH", value: post.cnh },
    { label: "Gênero", value: post.sexo },
    { label: "Data de nascimento", value: post.data_nacimento },
    { label: "Profissão", value: post.profession },
    { label: "Telefone", value: post.telefone },
    { label: "Telefone2", value: post.telefone2 },
    { label: "Estado civil", value: post.estado_civil },
    { label: "Nome do pai", value: post.nome_pai },
    { label: "Nome da mãe", value: post.nome_mae },
    { label: "Cidade de naturalidade", value: post.cidade_naturalidade },
    { label: "País de naturalidade", value: post.pais },
    { label: "Comentário", value: post.coment_text },
    { label: "Apólice", value: apolice },
    { label: "Seguradora", value: seguradora },
    { label: "Produto", value: produto },
    { label: "Placa", value: placa },
    { label: "Utilização", value: utilizacao },
    { label: "Modelo", value: modelo },
    { label: "Data_inicial", value: data_inicial },
    { label: "Data_final", value: data_final },
    { label: "CEP", value: post.cep },
    { label: "Rua", value: post.rua },
    { label: "Número", value: post.numero },
    { label: "Cidade", value: post.cidade },
    { label: "Bairro", value: post.bairro },
    { label: "Estado", value: post.estado },
    { label: "País onde mora", value: post.pais_mora },
    { label: "Status", value: post.status },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-red-500"
        >
          <IoIosCloseCircleOutline />
        </button>

        <ul className="flex space-x-4 border-b pb-2 mb-4">
          {tabs.map((tab) => (
            <li
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`cursor-pointer px-2 pb-1 relative
                bg-gradient-to-r from-sky-600 via-sky-400 to-sky-100
                bg-no-repeat bg-bottom
                ${
                  selectedTab === tab
                    ? "font-bold bg-[length:100%_3px]"
                    : "text-gray-500 bg-[length:0%_3px] hover:bg-[length:100%_3px]"
                }
                transition-all duration-300`}
            >
              {tab}
            </li>
          ))}
        </ul>

        {selectedTab === "Informações" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 text-sm text-gray-700">
            {detailFields.map(({ label, value }) => (
              <div key={label} className="flex flex-col">
                <span className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                  {label}
                </span>
                <span className="text-base font-medium text-gray-800">
                  {value || "-"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
              <input
                className="border py-2 px-2 w-full rounded"
                placeholder="Origem"
                value={newDoc.origem}
                onChange={(e) =>
                  setNewDoc((prev) => ({ ...prev, origem: e.target.value }))
                }
              />
              <input
                className="border p-2 rounded"
                placeholder="Título"
                value={newDoc.title}
                onChange={(e) =>
                  setNewDoc((prev) => ({ ...prev, title: e.target.value }))
                }
              />
              <input
                className="border p-2 rounded"
                placeholder="Responsável"
                value={newDoc.responsavel}
                onChange={(e) =>
                  setNewDoc((prev) => ({
                    ...prev,
                    responsavel: e.target.value,
                  }))
                }
              />
              <input
                type="file"
                className="border p-2 rounded"
                accept=".pdf,image/*"
                onChange={(e) =>
                  setNewDoc((prev) => ({
                    ...prev,
                    arquivo: e.target.files?.[0] || null,
                  }))
                }
              />
              <button
                onClick={handleAddDocument}
                className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
              >
                Adicionar Documento
              </button>
            </div>

            <table className="w-full text-sm text-left border-t">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-2">Origem</th>
                  <th className="p-2">Título</th>
                  <th className="p-2">Responsável</th>
                  <th className="p-2">Arquivo</th>
                  <th className="p-2">Data</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{doc.origem}</td>
                    <td className="p-2">{doc.title}</td>
                    <td className="p-2">{doc.responsavel}</td>
                    <td className="p-2">
                      <a
                        className="text-blue-600 hover:text-red-600 underline"
                        href={`${makeRequest.defaults.baseURL}/documentos/arquivo/${doc.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {doc.arquivoNome}
                      </a>
                    </td>
                    <td className="p-2">{doc.criadoEm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
