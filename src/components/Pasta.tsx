import React, { useState } from "react";
import makeRequest from "@/services/services";
import { AxiosError } from "axios";

export default function Pasta() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Selecione um arquivo Excel");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await makeRequest.post("/api/pasta", formData);
      const data = res.data;
      setMessage(data.message || "Arquivo enviado com sucesso!");
    } catch (error: unknown) {
      let errorMsg = "Erro na conexão com o servidor";
      if (error instanceof AxiosError) {
        errorMsg = error.response?.data?.error || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      setMessage(errorMsg);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-gray-50 rounded-lg shadow-lg font-sans text-center">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Importar Excel para MySQL
      </h1>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-600
          file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-600 file:text-white
          hover:file:bg-blue-700
          cursor-pointer
          mb-6"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors duration-300"
      >
        Enviar
      </button>

      {message && (
        <p
          className={`mt-6 font-semibold ${
            message.toLowerCase().includes("erro")
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
