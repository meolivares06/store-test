import {Column} from '@app/shared/components/datatable/datatable.model';

export const cols: Array<Column> = [
  { field: 'code', header: 'Cod. Id.', style: "width: 8rem" },
  { field: 'name', header: 'Nome', style: "width: 12rem" },
  { field: 'cpf', header: 'CPF', pipe: 'cpfCnpj', style: "width: 10rem" },
  { field: 'address', header: 'Endereço' },
  { field: 'email', header: 'Email', pipe: 'email' },
  { field: 'birthday', header: 'Data Nascimento', pipe: 'date' },
  { field: 'action', header: 'Actions' },
];
