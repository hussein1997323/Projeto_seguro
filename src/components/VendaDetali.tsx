"use client";

import { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

export interface IVenda {
  id: number;
  client_id: number;
  username: string;
  cpf: string;
  status: string;
  rua: string;
  cidade: string;
  apolice: string;
  seguro: string;
  produto: string;
  placa: string;
  modelo: string;
  utilizacao: string;
  chassi: string;
  endereco: string;
  cep: string;
  barrio: string;
  numero: string;
  complemento: string;
  estado: string;
  pais: string;
  cooporativa: string;
  data_inicio: string;
  data_final: string;
  valor: string | number;
  created_at: string;
}

interface Props {
  post: IVenda;
  onClose: () => void;
}

// Define tabs as a const tuple for precise typing
const tabs = ["Informações"] as const;
type Tab = (typeof tabs)[number];

export default function VendaDetailModal({ post, onClose }: Props) {
  const [selectedTab, setSelectedTab] = useState<Tab>(tabs[0]);

  const infoFields = [
    { label: "Cliente", value: post.username },
    { label: "CPF", value: post.cpf },
    { label: "Status", value: post.status },
    { label: "Rua", value: post.rua },
    { label: "Cidade", value: post.cidade },
    { label: "Apólice", value: post.apolice },
    { label: "Seguradora", value: post.seguro },
    { label: "Produto", value: post.produto },
    { label: "Placa", value: post.placa },
    { label: "Modelo", value: post.modelo },
    { label: "Utilização", value: post.utilizacao },
    { label: "Chassi", value: post.chassi },
    { label: "Endereço", value: post.endereco },
    { label: "CEP", value: post.cep },
    { label: "Bairro", value: post.barrio },
    { label: "Número", value: post.numero },
    { label: "Complemento", value: post.complemento },
    { label: "Estado", value: post.estado },
    { label: "País", value: post.pais },
    { label: "Cooperativa", value: post.cooporativa },
    { label: "Data Início", value: post.data_inicio },
    { label: "Data Final", value: post.data_final },
    {
      label: "Valor",
      value:
        typeof post.valor === "number" ? post.valor.toFixed(2) : post.valor,
    },
    {
      label: "Criado em",
      value: new Date(post.created_at).toLocaleDateString("pt-BR"),
    },
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

        {/* Abas */}
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

        {/* Conteúdo das abas */}
        {selectedTab === tabs[0] && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 text-sm text-gray-700">
            {infoFields.map(({ label, value }) => (
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
        )}
      </div>
    </div>
  );
}
