import {Sell} from '@feat/sell/sell.model';

export const sellAdapter = (items: (unknown & {creationDate: any})[]): Sell[] => items.map(item => {
  const creationDate = item?.['creationDate'];
  const formattedDate = typeof creationDate === 'string' ? new Date(item?.['creationDate']).toDateString() : item?.['creationDate'].toDate();
  return {
    ...item,
    creationDate: formattedDate
  } as Sell;
});

