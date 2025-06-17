export interface IVendaInfo {
  placa: string;
  modelo: string;
  utilizacao: string;
  chassi: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  barrio: string;
  estado: string;
  pais: string;
  cooporativa: string;
  data_inicio: string;
  data_final: string;
}

export interface IVendaPayload extends IVendaInfo {
  client_id: number;
  cpf: string;
  username: string;
  valor: string; // ou number, se você converter antes
  vendedor: string;
  status: string;
  rua: string;
  cidade: string;
  apolice: string;
  seguro: string; // ou boolean, conforme seu backend espera
  produto: string;
  id?: number;
}
