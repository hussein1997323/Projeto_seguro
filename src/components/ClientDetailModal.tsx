// src/components/ClientDetailModal.tsx
import { useEffect, useState } from "react";
import makeRequest from "@/services/services";
import { IPost } from "../types/postTypes";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface Props {
  post: IPost;
  onClose: () => void;
}

interface DocumentItem {
  id: number;
  origem: string;
  title: string;
  responsavel: string;
  arquivoNome: string;
  criadoEm: string;
}

export default function ClientDetailModal({ post, onClose }: Props) {
  const [selectedTab, setSelectedTab] = useState<"Informações" | "Documentos">(
    "Informações"
  );
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [newDoc, setNewDoc] = useState({
    origem: "",
    title: "",
    responsavel: "",
    arquivo: null as File | null,
  });

  useEffect(() => {
    if (selectedTab === "Documentos") {
      (async () => {
        const res = await makeRequest.get(`/documentos/cliente/${post.id}`);
        setDocuments(
          res.data.map((doc: any) => ({
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

    await makeRequest.post("/documentos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setNewDoc({ origem: "", title: "", responsavel: "", arquivo: null });
    setSelectedTab("Documentos");
  };

  const detailFields = [
    { label: "CPF", value: post.cpf },
    { label: "RG", value: post.rg },
    { label: "CNH", value: post.cnh },
    { label: "Genero", value: post.sexo },
    { label: "Data de nascimento", value: post.data_nacimento },
    { label: "Empresa", value: post.empresa },
    { label: "Profissão", value: post.profession },
    { label: "Atividade econômica", value: post.atividade_economica },
    { label: "Estado civil", value: post.estado_civil },
    { label: "Nome do pai", value: post.nome_pai },
    { label: "Nome da mãe", value: post.nome_mae },
    { label: "Cidade de naturalidade", value: post.cidade_naturalidade },
    { label: "País de naturalidade", value: post.pais },
    { label: "Comentário", value: post.coment_text },
    { label: "CEP", value: post.cep },
    { label: "Rua", value: post.rua },
    { label: "Número", value: post.numero },
    { label: "Cidade", value: post.cidade },
    { label: "Estado", value: post.estado },
    { label: "País onde mora", value: post.pais_mora },
    { label: "Status", value: post.status },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 shadow"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-red-500 "
        >
          <IoIosCloseCircleOutline />
        </button>

        <ul className="flex space-x-4 border-b pb-2 mb-4">
          {["Informações", "Documentos"].map((tab) => (
            <li
              key={tab}
              onClick={() => setSelectedTab(tab as any)}
              className={`cursor-pointer px-2 pb-1 relative
        bg-gradient-to-r from-sky-600 via-sky-400 to-sky-100
        bg-no-repeat bg-bottom
        ${
          selectedTab === tab
            ? "font-bold bg-[length:100%_3px]"
            : "text-gray-500 bg-[length:0%_3px] hover:bg-[length:100%_3px]"
        }
        transition-all duration-300
      `}
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
                  {value}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
              <input
                className="border py-2 px-2 w-50 focus-visible:outline-none rounded "
                placeholder="Origem"
                value={newDoc.origem}
                onChange={(e) =>
                  setNewDoc({ ...newDoc, origem: e.target.value })
                }
              />
              <input
                className="border p-2 rounded"
                placeholder="Título"
                value={newDoc.title}
                onChange={(e) =>
                  setNewDoc({ ...newDoc, title: e.target.value })
                }
              />
              <input
                className="border p-2 rounded"
                placeholder="Responsável"
                value={newDoc.responsavel}
                onChange={(e) =>
                  setNewDoc({ ...newDoc, responsavel: e.target.value })
                }
              />
              <input
                type="file"
                className="border p-2 rounded"
                accept=".pdf,image/*"
                onChange={(e) =>
                  setNewDoc({ ...newDoc, arquivo: e.target.files?.[0] || null })
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
