import {Client} from '@feat/client/client.model';

export const clientAdapter = (items: (unknown & {birthday: any})[]): Client[] => items.map(item =>
  ({...item, birthday: item?.['birthday'].toDate()})) as Client[];
