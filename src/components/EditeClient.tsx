import React, { useState } from "react";
import { IPost } from "../types/postTypes";
import makeRequest from "@/services/services";
import { AxiosError } from "axios";

interface AddClientProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  initialData?: IPost;
}

export default function AddClient({
  setShowModal,
  initialData,
}: AddClientProps) {
  // Use Partial<IPost> to allow missing id during form state
  const [formData, setFormData] = useState<Partial<IPost>>({
    username: initialData?.username || "",
    email: initialData?.email || "",
    cpf: initialData?.cpf || "",
    rg: initialData?.rg || "",
    userImg: initialData?.userImg || "",
    tipo: initialData?.tipo || "",
    cnh: initialData?.cnh || "",
    telefone: initialData?.telefone || "",
    sexo: initialData?.sexo || "",
    empresa: initialData?.empresa || "",
    profession: initialData?.profession || "",
    atividade_economica: initialData?.atividade_economica || "",
    estado_civil: initialData?.estado_civil || "",
    nome_pai: initialData?.nome_pai || "",
    nome_mae: initialData?.nome_mae || "",
    cidade_naturalidade: initialData?.cidade_naturalidade || "",
    pais: initialData?.pais || "",
    coment_text: initialData?.coment_text || "",
    cep: initialData?.cep || "",
    rua: initialData?.rua || "",
    numero: initialData?.numero || "",
    cidade: initialData?.cidade || "",
    estado: initialData?.estado || "",
    pais_mora: initialData?.pais_mora || "",
    data_nacimento: initialData?.data_nacimento || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData) {
      return; // criação não implementada
    }

    const endpoint = "/clienteEdite";
    // payload includes id from initialData
    const payload: IPost = { ...(formData as IPost), id: initialData.id };
    console.log("Enviando PATCH para:", endpoint, "com payload:", payload);
    try {
      const res = await makeRequest.patch(endpoint, payload);
      console.log("Requisição PATCH bem-sucedida. Resposta:", res);
      alert("Cliente atualizado com sucesso!");
      setShowModal(false);
    } catch (err: unknown) {
      console.error("Erro na requisição PATCH:");
      let errorMessage = "Erro ao salvar cliente.";
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message;
        console.error("Detalhes da resposta de erro:", err.response?.data);
        console.error("Status do erro:", err.response?.status);
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      alert(errorMessage);
    }
  };

  const fields = [
    { name: "username", label: "Nome", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "cpf", label: "CPF", type: "text" },
    { name: "rg", label: "RG", type: "text" },
    {
      name: "userImg",
      label: "URL da Imagem",
      type: "text",
      placeholder: "https://...",
    },
    { name: "tipo", label: "Tipo", type: "text" },
    { name: "cnh", label: "CNH", type: "text" },
    { name: "telefone", label: "Telefone", type: "text" },
    { name: "sexo", label: "Sexo", type: "text" },
    { name: "empresa", label: "Empresa", type: "text" },
    { name: "profession", label: "Profissão", type: "text" },
    { name: "atividade_economica", label: "Atividade Econômica", type: "text" },
    { name: "estado_civil", label: "Estado Civil", type: "text" },
    { name: "nome_pai", label: "Nome do Pai", type: "text" },
    { name: "nome_mae", label: "Nome da Mãe", type: "text" },
    {
      name: "cidade_naturalidade",
      label: "Cidade de Naturalidade",
      type: "text",
    },
    { name: "pais", label: "País", type: "text" },
    { name: "coment_text", label: "Comentário", type: "textarea" },
    { name: "cep", label: "CEP", type: "text" },
    { name: "rua", label: "Rua", type: "text" },
    { name: "numero", label: "Número", type: "text" },
    { name: "cidade", label: "Cidade", type: "text" },
    { name: "estado", label: "Estado", type: "text" },
    { name: "pais_mora", label: "País onde Mora", type: "text" },
    { name: "data_nacimento", label: "Data de Nascimento", type: "date" },
  ];

  return (
    <div
      onClick={() => setShowModal(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-auto"
      >
        <h2 className="text-2xl font-semibold mb-6 text-left">
          Editar Cliente
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col">
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 mb-1 text-left"
              >
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name as keyof Partial<IPost>] || ""}
                  onChange={handleChange}
                  rows={3}
                  className="p-2 border rounded-lg"
                />
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name as keyof Partial<IPost>] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="p-2 border rounded-lg"
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
