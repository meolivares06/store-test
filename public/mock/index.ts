

// Generar datos mock para Address
import {Address, Client} from '@feat/client/client.model';
import {Product} from '@feat/product/product.model';
import {Sell} from '@feat/sell/sell.model';

function generateMockAddress(index: number): Address {
  return {
    cep: 10000000 + index,
    logradouro: `Rua ${index}`,
    no: index + 1,
    bairro: `Bairro ${index}`,
    complemento: `Complemento ${index}`,
    cidade: `Cidade ${index}`,
  };
}

// Generar datos mock para Clients
function generateMockClients(): Client[] {
  return Array.from({ length: 40 }, (_, index) => ({
    id: `client-${index + 1}`,
    code: `C-${1000 + index}`,
    name: `Client ${index + 1}`,
    cpf: `${10000000000 + index}`,
    address: generateMockAddress(index),
    email: `client${index + 1}@example.com`,
    birthday: new Date(1990, index % 12, (index % 28) + 1),
  }));
}

// Generar datos mock para Products
function generateMockProducts(): Product[] {
  return Array.from({ length: 40 }, (_, index) => ({
    id: `product-${index + 1}`,
    code: `P-${2000 + index}`,
    name: `Product ${index + 1}`,
    value: parseFloat((Math.random() * 100 + 10).toFixed(2)), // Valores aleatorios entre 10 y 110
  }));
}

// Generar datos mock para Sells
function generateMockSells(clients: Client[], products: Product[]): Sell[] {
  return Array.from({ length: 40 }, (_, index) => {
    const client = clients[index % clients.length];
    const product = products[index % products.length];
    const total = parseFloat((product.value * (Math.random() * 5 + 1)).toFixed(2)); // Total aleatorio basado en el valor del producto
    return {
      id: `sell-${index + 1}`,
      code: `S-${3000 + index}`,
      creationDate: new Date(2023, index % 12, (index % 28) + 1).toISOString(),
      clientId: client.id,
      productId: product.id,
      total,
    };
  });
}

// Generar las listas
const mockClients = generateMockClients();
const mockProducts = generateMockProducts();
const mockSells = generateMockSells(mockClients, mockProducts);

// Exportar los mocks
export { mockClients, mockProducts, mockSells };
