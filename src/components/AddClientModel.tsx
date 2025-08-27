import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import makeRequest from "@/services/services";
import { IPost } from "@/types/postTypes";
import {
  formatarCPF,
  formatarRG,
  formatarCNH,
  formatarTelefone,
  formatarCEP,
} from "@/utils/formatters";
import { toast } from "react-toastify";
interface ExtendedPost extends IPost {
  selectedTab?: string;
}
interface ClientModalProps {
  initialData: IPost | null;
  onClose: () => void;
  onSave: (savedClient: IPost) => void;
}

export default function ClientModal({
  initialData,
  onClose,
  onSave,
}: ClientModalProps) {
  const [formData, setFormData] = useState<ExtendedPost>({
    ...(initialData || {
      id: 0,
      username: "",
      email: "",
      cpf: "",
      rg: "",
      userImg: "",
      tipo: "",
      cnh: "",
      telefone: "",
      sexo: "",
      status: "",
      bairro: "",
      profession: "",
      telefone2: "",
      estado_civil: "",
      nome_pai: "",
      nome_mae: "",
      cidade_naturalidade: "",
      pais: "",
      data_nacimento: "",
      coment_text: "",
      cep: "",
      rua: "",
      numero: "",
      cidade: "",
      estado: "",
      pais_mora: "",
    }),
    selectedTab: "pessoais",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        status: initialData.status || "",
        sexo: initialData.sexo || "",
        tipo: initialData.tipo || "",
        estado_civil: initialData.estado_civil || "",
      });
    }
  }, [initialData]);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buscarEndereco = async (cepLimpo: string) => {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          rua: data.logradouro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
          bairro: data.bairro || "",
          pais_mora: "Brasil",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          rua: "",
          cidade: "",
          estado: "",
          bairro: "",
          pais_mora: "",
        }));
      }
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
      setFormData((prev) => ({
        ...prev,
        rua: "",
        cidade: "",
        estado: "",
        bairro: "",
        pais_mora: "",
      }));
    }
  };

  useEffect(() => {
    const cepLimpo = formData.cep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      buscarEndereco(cepLimpo);
    }
  }, [formData.cep]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      data_nacimento:
        typeof formData.data_nacimento === "string" &&
        formData.data_nacimento.trim() !== ""
          ? formData.data_nacimento.trim()
          : null,
    };

    if (initialData) {
      try {
        payload.id = initialData.id;
        const endpoint = "/clienteEdite/clienteEdite";
        const res = await makeRequest.patch(endpoint, payload);
        onSave(res.data as IPost);
        toast.success("Cliente atualizado com sucesso!");
        onClose();
      } catch (err: unknown) {
        console.error("Erro na requisição PATCH:", err);
        toast.error("Erro ao atualizar cliente.");
      }
    } else {
      try {
        const res = await makeRequest.post("/clientModel/clientes", payload);
        onSave(res.data as IPost);
      } catch (error: unknown) {
        let errorMessage = "Erro ao criar cliente.";
        if (error instanceof AxiosError) {
          errorMessage += " " + (error.response?.data?.msg || error.message);
        } else if (error instanceof Error) {
          errorMessage += " " + error.message;
        }
        console.error(errorMessage, error);
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-lg font-bold mb-4">
          {initialData ? "Editar Cliente" : "Adicionar Cliente"}
        </h2>

        {/* Tabs */}
        <ul className="flex space-x-4 border-b pb-2 mb-4">
          {[
            ["pessoais", "Informações pessoais"],
            ["complementares", "Informações complementares"],
            ["address", "Endereço"],
          ].map(([key, label]) => (
            <li
              key={key}
              className={`cursor-pointer ${
                formData.selectedTab === key
                  ? "font-bold border-b-2 border-blue-500"
                  : ""
              }`}
              onClick={() =>
                setFormData((prev: ExtendedPost) => ({
                  ...prev,
                  selectedTab: key,
                }))
              }
            >
              {label}
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            (formData.selectedTab || "pessoais") === "pessoais" && (
              <>
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    name="username"
                    value={formData.username}
                    placeholder="Nome"
                    onChange={handleChange}
                    className="flex-1 border px-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
                  />
                  <input
                    name="rg"
                    maxLength={12}
                    value={formatarRG(formData.rg)}
                    placeholder="RG"
                    onChange={handleChange}
                    className="flex-1 border px-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
                  />
                  <input
                    name="cpf"
                    maxLength={18}
                    value={formatarCPF(formData.cpf)}
                    placeholder="CPF"
                    onChange={handleChange}
                    className="flex-1 border px-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    name="cnh"
                    maxLength={11}
                    value={formatarCNH(formData.cnh)}
                    placeholder="CNH"
                    onChange={handleChange}
                    className="flex-1 border px-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
                  />
                  <input
                    name="userImg"
                    type="file"
                    accept="image/*"
                    // Atenção: arquivos requerem tratamento diferente (não enviar value diretamente)
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // se o backend aceita URL, você teria que enviar via FormData ou converter em Base64
                        setFormData((prev) => ({
                          ...prev,
                          userImg: file.name,
                        }));
                      }
                    }}
                    className="flex-1 border px-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    name="email"
                    value={formData.email}
                    placeholder="Email"
                    onChange={handleChange}
                    className="flex-1 border px-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
                  />
                  <input
                    name="telefone"
                    maxLength={15}
                    value={formatarTelefone(formData.telefone)}
                    placeholder="Telefone"
                    onChange={handleChange}
                    className="flex-1 border px-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
                  />
                  <input
                    name="telefone2"
                    maxLength={15}
                    value={formatarTelefone(formData.telefone2)}
                    placeholder="Telefone-2"
                    onChange={handleChange}
                    className="flex-1 border px-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
                  />
                </div>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
                >
                  <option className="text-gray-300" value="" disabled>
                    Selecione o perfil
                  </option>
                  <option value="cliente">Cliente</option>
                  <option value="contato">Contato</option>
                </select>
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
                >
                  <option className="text-gray-300" value="" disabled>
                    Selecione o sexo
                  </option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </>
            )
          }

          {(formData.selectedTab || "pessoais") === "complementares" && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="data_nacimento"
                    className="text-sm text-gray-700 mb-1"
                  >
                    Data de nascimento
                  </label>
                  <input
                    name="data_nacimento"
                    type="date"
                    value={formData.data_nacimento}
                    onChange={handleChange}
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500"
                    placeholder="AAAA-mm-dd"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="Staus" className="text-sm text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    id="status"
                  >
                    <option value="" disabled>
                      Selecione o status
                    </option>
                    <option value="ativo">ativo</option>
                    <option value="inativo">inativo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  name="profession"
                  value={formData.profession}
                  placeholder="Profissão"
                  onChange={handleChange}
                  className="flex-1 border px-2 p-2 rounded focus:outline-none focus:ring-2 focus-visible:outline-none focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
                />

                <select
                  name="estado_civil"
                  value={formData.estado_civil}
                  onChange={handleChange}
                  className="flex-1 border px-2 p-2 rounded focus:outline-none focus:ring-2 focus-visible:outline-none focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
                >
                  <option value="" disabled>
                    Selecione o estado civil
                  </option>
                  <option value="casado">Casado</option>
                  <option value="divorciado">Divorciado</option>
                  <option value="solteiro">Solteiro</option>
                  <option value="viuvo">Viúvo</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="nome_pai"
                  value={formData.nome_pai}
                  placeholder="Nome do pai"
                  onChange={handleChange}
                  className="flex-1 border px-2 p-2 rounded focus:outline-none focus:ring-2 focus-visible:outline-none focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
                />
                <input
                  name="nome_mae"
                  value={formData.nome_mae}
                  placeholder="Nome da mãe"
                  onChange={handleChange}
                  className="flex-1 border px-2 p-2 rounded focus:outline-none focus:ring-2 focus-visible:outline-none focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="cidade_naturalidade"
                  value={formData.cidade_naturalidade}
                  placeholder="Cidade (Naturalidade)"
                  onChange={handleChange}
                  className="flex-1 border px-2 p-2 rounded focus:outline-none focus:ring-2 focus-visible:outline-none focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
                />
                <input
                  name="pais"
                  value={formData.pais}
                  placeholder="País (Nacionalidade)"
                  onChange={handleChange}
                  className="flex-1 border px-2 p-2 rounded focus:outline-none focus:ring-2 focus-visible:outline-none focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
                />
              </div>
              <textarea
                name="coment_text"
                value={formData.coment_text}
                placeholder="Comentários"
                onChange={handleChange}
                className="border flex items-center py-10 flex-1 px-2 p-2 rounded focus:outline-none focus:ring-2 focus-visible:outline-none focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
              />
            </>
          )}

          {(formData.selectedTab || "pessoais") === "address" && (
            <>
              <div className="grid">
                <input
                  name="cep"
                  value={formatarCEP(formData.cep)}
                  placeholder="CEP"
                  onChange={handleChange}
                  className="flex-1 border px-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
                  maxLength={9}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="rua"
                  value={formData.rua}
                  placeholder="Digite a rua"
                  onChange={handleChange}
                  className="flex-1 border px-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
                />
                <input
                  name="numero"
                  value={formData.numero}
                  placeholder="Digite o número"
                  onChange={handleChange}
                  className="flex-1 border px-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="cidade"
                  value={formData.cidade}
                  placeholder="Digite a cidade"
                  onChange={handleChange}
                  className="flex-1 border px-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
                />
                <input
                  name="estado"
                  value={formData.estado}
                  placeholder="Digite o estado"
                  onChange={handleChange}
                  className="flex-1 border px-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
                />
              </div>
              <input
                name="Bairro"
                value={formData.bairro}
                placeholder="Barrio"
                onChange={handleChange}
                className="flex-1 border px-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
              />
              <input
                name="pais_mora"
                value={formData.pais_mora}
                placeholder="Digite o país"
                onChange={handleChange}
                className="flex-1 border px-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 hover:border-sky-500"
              />
            </>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-600 hover:border-red-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-green-400"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
