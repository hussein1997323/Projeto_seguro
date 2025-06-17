"use client";

import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// Tipagem do provider
interface SidebarProviderProps {
  children: ReactNode;
}

// Tipagem do contexto
interface SidebarContextType {
  showSidebar: boolean;
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
}

// Criação do contexto com valor inicial opcional
export const SidebarContext = createContext<SidebarContextType>({
  showSidebar: false,
  setShowSidebar: () => {}, // será sobrescrito no provider
});

// Provider do contexto
export const SidebarContextProvider = ({ children }: SidebarProviderProps) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <SidebarContext.Provider value={{ showSidebar, setShowSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
