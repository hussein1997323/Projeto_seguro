export const formatarCPF = (doc: string | undefined | null): string => {
  if (!doc) return "";

  const numeros = doc.replace(/\D/g, "");

  // CPF → até 11 dígitos
  if (numeros.length <= 11) {
    if (numeros.length <= 3) return numeros;
    if (numeros.length <= 6) return numeros.replace(/(\d{3})(\d{1,})/, "$1.$2");
    if (numeros.length <= 9)
      return numeros.replace(/(\d{3})(\d{3})(\d{1,})/, "$1.$2.$3");
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{1,})/, "$1.$2.$3-$4");
  }

  // CNPJ → até 14 dígitos
  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 5) return numeros.replace(/(\d{2})(\d{1,})/, "$1.$2");
  if (numeros.length <= 8)
    return numeros.replace(/(\d{2})(\d{3})(\d{1,})/, "$1.$2.$3");
  if (numeros.length <= 12)
    return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{1,})/, "$1.$2.$3/$4");
  return numeros.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,})/,
    "$1.$2.$3/$4-$5"
  );
};

export const formatarRG = (rg: string | null | undefined): string => {
  if (!rg) return "";

  rg = rg.replace(/[^\dXx]/g, "").toUpperCase();

  if (rg.length <= 2) return rg;
  if (rg.length <= 5) return rg.replace(/(\d{2})(\d{1,3})/, "$1.$2");
  if (rg.length <= 8) return rg.replace(/(\d{2})(\d{3})(\d{1,3})/, "$1.$2.$3");
  return rg.replace(/(\d{2})(\d{3})(\d{3})([\dX])/, "$1.$2.$3-$4");
};

export const formatarCNH = (cnh: string | null | undefined): string => {
  if (!cnh) return "";

  cnh = cnh.replace(/\D/g, "");

  if (cnh.length > 11) cnh = cnh.substring(0, 11);

  return cnh;
};

export const formatarTelefone = (
  telefone: string | null | undefined
): string => {
  if (!telefone) return "";

  telefone = telefone.replace(/\D/g, "");

  if (telefone.length < 10 || telefone.length > 11) return telefone;

  const ddd = telefone.slice(0, 2);
  const numero = telefone.slice(2);

  const numeroFormatado =
    numero.length === 9
      ? `${numero.slice(0, 5)}-${numero.slice(5)}`
      : `${numero.slice(0, 4)}-${numero.slice(4)}`;

  return `(${ddd}) ${numeroFormatado}`;
};

export const formatarCEP = (cep: string | null | undefined): string => {
  if (!cep) return "";

  cep = cep.replace(/\D/g, "").substring(0, 8);

  if (cep.length <= 5) return cep;

  return cep.replace(/^(\d{5})(\d{1,3})$/, "$1-$2");
};
