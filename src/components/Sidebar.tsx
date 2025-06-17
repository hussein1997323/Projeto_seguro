"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CiGrid32, CiBank } from "react-icons/ci";
import { IoCalendarOutline } from "react-icons/io5";
import { FaRegAddressCard, FaAngleRight } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import { MdPersonAddAlt } from "react-icons/md";
import { TiShoppingCart } from "react-icons/ti";
import ProProtectedRoute from "./AdimPage";

function Sidebar() {
  const [user, setUser] = useState({ username: "", userImg: "" });
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saveUser = localStorage.getItem("sistema-cadastro-keite:user");
    if (saveUser) {
      setUser(JSON.parse(saveUser));
    }
  }, []);

  const logout = (e: any) => {
    e.preventDefault();
    localStorage.removeItem("sistema-cadastro-keite:user");
    localStorage.removeItem("sistema-cadastro-keite:token");
    router.push("/login");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMenu(true);
      } else {
        setShowMenu(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <aside
      className={`relative h-screen flex flex-col bg-gray-100 
    ${showMenu ? "w-36" : "w-16"} 
    transition-all duration-300 shadow-md`}
    >
      {/* Botão de Toggle */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="md:hidden absolute right-4 top-4 z-20 text-xl bg-white rounded-full p-1 shadow-md"
      >
        <FaAngleRight
          className={`transition-transform duration-300 ${
            showMenu ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Avatar e nome */}
      <div className="flex items-center gap-3 px-4 mt-12 mb-6 relative">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={
            user.userImg ||
            "https://cdn-icons-png.flaticon.com/256/149/149071.png"
          }
          alt="User"
        />
        {showMenu && (
          <span className="text-sm font-medium text-gray-800 truncate max-w-[120px]">
            {user.username || "Usuário"}
          </span>
        )}
      </div>

      {/* Menu Links */}
      <nav className="flex flex-col gap-2 px-2 text-sm text-gray-700">
        <ProProtectedRoute allowLevels={["1", "2"]}>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-50 transition"
          >
            <CiGrid32 size={20} />
            {showMenu && <span>Dashboard</span>}
          </Link>
          <Link
            href="/user"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-50 transition"
          >
            <MdPersonAddAlt size={20} />
            {showMenu && <span>Usuário</span>}
          </Link>
        </ProProtectedRoute>

        {/* Cliente com submenu */}
        <div className="relative group">
          <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-50 transition cursor-pointer">
            <FaRegAddressCard size={20} />
            {showMenu && (
              <Link href="/cliente">
                <span>Cliente</span>
              </Link>
            )}
          </div>
          {showMenu && (
            <div className="absolute top-0 left-full ml-2 bg-white shadow-md rounded-md p-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[100px]">
              <ul>
                <li>
                  <Link
                    href="/cliente/pasta"
                    className="block px-3 py-1 rounded hover:bg-gray-100"
                  >
                    Pasta
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        <Link
          href="/vendas"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-50 transition"
        >
          <TiShoppingCart size={20} />
          {showMenu && <span>Seguros</span>}
        </Link>

        <ProProtectedRoute allowLevels={["1", "2"]}>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-50 transition"
          >
            <CiBank size={20} />
            {showMenu && <span>Financeiro</span>}
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-50 transition"
          >
            <IoCalendarOutline size={20} />
            {showMenu && <span>Agenda</span>}
          </Link>
        </ProProtectedRoute>

        <Link
          href="#"
          onClick={logout}
          className="flex items-center gap-3 mt-auto mb-4 px-3 py-2 text-red-600 rounded-md hover:bg-red-50 transition"
        >
          <ImExit size={20} />
          {showMenu && <span className="font-medium">Sair</span>}
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
