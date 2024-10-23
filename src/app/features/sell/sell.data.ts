import {Column} from '@app/shared/components/datatable/datatable.model';
export const cols: Array<Column> = [
  { field: 'code', header: 'Cod. Id.', style: "width: 8rem" },
  { field: 'creationDate', header: 'Data', style: "width: 12rem", pipe: 'date' },
  { field: 'clientId', header: 'Client'},
  { field: 'productId', header: 'Product'},
  { field: 'total', header: 'Valor'},
  { field: 'action', header: 'Actions' },
];

