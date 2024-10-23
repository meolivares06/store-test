import {Column} from '@app/shared/components/datatable/datatable.model';
export const cols: Array<Column> = [
  { field: 'code', header: 'Cod. Id.', style: "width: 8rem" },
  { field: 'name', header: 'Nome', style: "width: 12rem" },
  { field: 'value', header: 'Valor', pipe: 'currency', class: "w-full"},
  { field: 'action', header: 'Actions' },
];
