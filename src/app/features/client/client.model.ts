export interface Address {
  cep: number;
  logradouro: string;
  no: number;
  bairro: string;
  complemento: string;
  cidade: string;
}
export interface Client {
  id: string;
  code: string;
  name: string;
  cpf: string;
  address: Address;
  email: string;
  birthday: Date;
}
