import {Sell} from '@feat/sell/sell.model';

export const sellAdapter = (items: (unknown & {creationDate: any})[]): Sell[] => items.map(item =>
  ({...item, creationDate: new Date(item?.['creationDate']).toDateString()})) as Sell[];
