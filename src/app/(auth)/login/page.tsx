"use client";

import Link from "next/link";
import makeRequest from "@/services/services";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("sistema-cadastro-keite:token");
    if (token) {
      router.replace("/"); // Se já logado, vai direto pra home
    }
  });

  const handlogin = async (e: any) => {
    e.preventDefault();

    try {
      const res = await makeRequest.post("/auth/login", { login, password });

      localStorage.setItem(
        "sistema-cadastro-keite:user",
        JSON.stringify(res.data.data.user)
      );
      localStorage.setItem(
        "sistema-cadastro-keite:token",
        JSON.stringify(res.data.data.token)
      );

      router.replace("/"); // Redireciona e evita voltar
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  return (
    <>
      <h1 className="text-center text-4xl font-bold text-sky-500 mb-6">GR</h1>

      <form className="space-y-4" onSubmit={handlogin}>
        <input
          type="text"
          value={login}
          onChange={(e) => setLogin(e.currentTarget.value)}
          placeholder="Digite seu email ou CPF"
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          placeholder="Digite sua senha"
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
        />

        <button
          type="submit"
          className="w-full bg-sky-500 text-white py-2 rounded-md text-sm hover:bg-sky-600 transition"
        >
          ENTRAR
        </button>
      </form>

      <div className="mt-5 text-center">
        <Link href="#">
          <span className="text-sky-500 text-sm hover:underline">
            ESQUECEU SUA SENHA?
          </span>
        </Link>
      </div>
    </>
  );
}
