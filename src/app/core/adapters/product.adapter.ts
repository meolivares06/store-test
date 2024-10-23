import {Product} from '@feat/product/product.model';

export const productAdapter = (items: (unknown)[]): Product[] => items.map(item => item) as Product[];
