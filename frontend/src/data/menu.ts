import { MenuItem } from '../types';

export const ALLERGEN_EMOJI: Record<string, string> = {
  'gluten': '🌾',
  'lácteos': '🥛',
  'huevo': '🥚',
  'marisco': '🦐',
  'pescado': '🐟',
  'sulfitos': '🍇',
  'frutos secos': '🥜',
  'soja': '🫘',
  'mostaza': '🌿',
  'apio': '🥬',
};

export const MENU_CATEGORIES = ['Entrantes', 'Carnes', 'Pescados', 'Arroces', 'Postres', 'Bebidas', 'Cafés'];

export const MENU: MenuItem[] = [
  // ENTRANTES
  { id: 'e1', name: 'Croquetas caseras (6u)', price: 7.50, allergens: ['gluten', 'lácteos', 'huevo'], section: 'kitchen', category: 'Entrantes' },
  { id: 'e2', name: 'Jamón ibérico', price: 14.00, allergens: [], section: 'kitchen', category: 'Entrantes' },
  { id: 'e3', name: 'Ensalada mixta', price: 6.50, allergens: [], section: 'kitchen', category: 'Entrantes' },
  { id: 'e4', name: 'Patatas bravas', price: 5.50, allergens: ['gluten'], section: 'kitchen', category: 'Entrantes' },
  { id: 'e5', name: 'Gambas al ajillo', price: 11.00, allergens: ['marisco'], section: 'kitchen', category: 'Entrantes' },
  { id: 'e6', name: 'Tabla de quesos', price: 12.00, allergens: ['lácteos'], section: 'kitchen', category: 'Entrantes' },
  { id: 'e7', name: 'Pimientos de padrón', price: 6.00, allergens: [], section: 'kitchen', category: 'Entrantes' },
  { id: 'e8', name: 'Huevos rotos con jamón', price: 9.50, allergens: ['huevo'], section: 'kitchen', category: 'Entrantes' },

  // CARNES
  { id: 'c1', name: 'Chuletón 400g', price: 24.00, allergens: [], section: 'kitchen', category: 'Carnes' },
  { id: 'c2', name: 'Pollo a la brasa', price: 13.50, allergens: [], section: 'kitchen', category: 'Carnes' },
  { id: 'c3', name: 'Solomillo ibérico', price: 22.00, allergens: [], section: 'kitchen', category: 'Carnes' },
  { id: 'c4', name: 'Costillas BBQ', price: 16.00, allergens: ['gluten'], section: 'kitchen', category: 'Carnes' },
  { id: 'c5', name: 'Secreto ibérico', price: 18.00, allergens: [], section: 'kitchen', category: 'Carnes' },
  { id: 'c6', name: 'Hamburguesa artesana', price: 14.50, allergens: ['gluten', 'huevo', 'lácteos'], section: 'kitchen', category: 'Carnes' },

  // PESCADOS
  { id: 'p1', name: 'Dorada a la sal', price: 19.00, allergens: ['pescado'], section: 'kitchen', category: 'Pescados' },
  { id: 'p2', name: 'Pulpo a la gallega', price: 17.00, allergens: ['marisco'], section: 'kitchen', category: 'Pescados' },
  { id: 'p3', name: 'Bacalao al pil-pil', price: 18.00, allergens: ['pescado', 'lácteos'], section: 'kitchen', category: 'Pescados' },
  { id: 'p4', name: 'Lubina al horno', price: 21.00, allergens: ['pescado'], section: 'kitchen', category: 'Pescados' },
  { id: 'p5', name: 'Calamar a la romana', price: 12.00, allergens: ['marisco', 'gluten', 'huevo'], section: 'kitchen', category: 'Pescados' },

  // ARROCES
  { id: 'a1', name: 'Paella valenciana', price: 16.00, allergens: ['marisco'], section: 'kitchen', category: 'Arroces' },
  { id: 'a2', name: 'Arroz negro', price: 17.00, allergens: ['marisco', 'pescado'], section: 'kitchen', category: 'Arroces' },
  { id: 'a3', name: 'Arroz con bogavante', price: 28.00, allergens: ['marisco'], section: 'kitchen', category: 'Arroces' },

  // POSTRES
  { id: 'po1', name: 'Tarta de queso', price: 6.00, allergens: ['lácteos', 'huevo', 'gluten'], section: 'kitchen', category: 'Postres' },
  { id: 'po2', name: 'Coulant de chocolate', price: 6.50, allergens: ['gluten', 'lácteos', 'huevo'], section: 'kitchen', category: 'Postres' },
  { id: 'po3', name: 'Helado artesano', price: 4.50, allergens: ['lácteos', 'huevo'], section: 'kitchen', category: 'Postres' },
  { id: 'po4', name: 'Flan de huevo', price: 4.00, allergens: ['huevo', 'lácteos'], section: 'kitchen', category: 'Postres' },
  { id: 'po5', name: 'Fruta de temporada', price: 4.50, allergens: [], section: 'kitchen', category: 'Postres' },

  // BEBIDAS
  { id: 'b1', name: 'Cerveza', price: 2.50, allergens: ['gluten'], section: 'bar', category: 'Bebidas' },
  { id: 'b2', name: 'Caña', price: 1.80, allergens: ['gluten'], section: 'bar', category: 'Bebidas' },
  { id: 'b3', name: 'Vino tinto copa', price: 3.00, allergens: ['sulfitos'], section: 'bar', category: 'Bebidas' },
  { id: 'b4', name: 'Vino blanco copa', price: 3.00, allergens: ['sulfitos'], section: 'bar', category: 'Bebidas' },
  { id: 'b5', name: 'Agua mineral', price: 1.50, allergens: [], section: 'bar', category: 'Bebidas' },
  { id: 'b6', name: 'Refresco', price: 2.00, allergens: [], section: 'bar', category: 'Bebidas' },
  { id: 'b7', name: 'Zumo natural', price: 3.50, allergens: [], section: 'bar', category: 'Bebidas' },
  { id: 'b8', name: 'Cocktail del día', price: 8.00, allergens: ['sulfitos'], section: 'bar', category: 'Bebidas' },
  { id: 'b9', name: 'Botella vino tinto', price: 14.00, allergens: ['sulfitos'], section: 'bar', category: 'Bebidas' },

  // CAFÉS
  { id: 'ca1', name: 'Café solo', price: 1.50, allergens: [], section: 'bar', category: 'Cafés' },
  { id: 'ca2', name: 'Café con leche', price: 1.80, allergens: ['lácteos'], section: 'bar', category: 'Cafés' },
  { id: 'ca3', name: 'Cortado', price: 1.60, allergens: ['lácteos'], section: 'bar', category: 'Cafés' },
  { id: 'ca4', name: 'Té / infusión', price: 2.00, allergens: [], section: 'bar', category: 'Cafés' },
  { id: 'ca5', name: 'Chupito', price: 2.50, allergens: [], section: 'bar', category: 'Cafés' },
];

export const getMenuByCategory = (): Record<string, MenuItem[]> => {
  return MENU_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = MENU.filter(item => item.category === cat);
    return acc;
  }, {} as Record<string, MenuItem[]>);
};
