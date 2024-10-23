import {Sell} from '@feat/sell/sell.model';

export const sellAdapter = (items: (unknown & {creationDate: any})[]): Sell[] => items.map(item =>
  ({...item, creationDate: item?.['creationDate'].toDate()})) as Sell[];
