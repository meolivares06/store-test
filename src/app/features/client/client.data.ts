import {Column} from '@feat/client/client.model';

export const cols: Array<Column & {class?: string}> = [
  { field: 'email', header: 'Email' },
  { field: 'name', header: 'Name' },
  { field: 'phone', header: 'Phone' }
];
