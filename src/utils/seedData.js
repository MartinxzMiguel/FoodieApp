import { db } from '../config/firebase';

const menuItems = [
  {
    id: 'dish_001',
    name: 'Bandeja Paisa',
    description: 'Plato típico colombiano con frijoles, arroz, chicharrón, carne molida, chorizo, huevo frito, tajada de plátano, aguacate y arepa.',
    price: 28000,
    category: 'Platos Fuertes',
    image: 'https://via.placeholder.com/300x200/E85D04/FFFFFF?text=Bandeja+Paisa',
    rating: 4.8,
    available: true,
  },
  {
    id: 'dish_002',
    name: 'Ajiaco Santafereño',
    description: 'Sopa bogotana con tres tipos de papa, pollo desmenuzado, mazorca, guascas, alcaparras y crema.',
    price: 22000,
    category: 'Sopas',
    image: 'https://via.placeholder.com/300x200/2B9348/FFFFFF?text=Ajiaco',
    rating: 4.6,
    available: true,
  },
  {
    id: 'dish_003',
    name: 'Empanadas Colombianas',
    description: 'Empanadas crujientes de maíz rellenas de carne y papa, acompañadas de ají casero.',
    price: 8000,
    category: 'Entradas',
    image: 'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Empanadas',
    rating: 4.5,
    available: true,
  },
  {
    id: 'dish_004',
    name: 'Sancocho de Gallina',
    description: 'Sopa tradicional con gallina criolla, yuca, plátano, papa, mazorca y cilantro.',
    price: 25000,
    category: 'Sopas',
    image: 'https://via.placeholder.com/300x200/16A34A/FFFFFF?text=Sancocho',
    rating: 4.7,
    available: true,
  },
  {
    id: 'dish_005',
    name: 'Lomo de Cerdo en Salsa BBQ',
    description: 'Lomo de cerdo jugoso bañado en salsa BBQ ahumada, con puré de papa y ensalada fresca.',
    price: 32000,
    category: 'Platos Fuertes',
    image: 'https://via.placeholder.com/300x200/DC2626/FFFFFF?text=Lomo+BBQ',
    rating: 4.4,
    available: true,
  },
  {
    id: 'dish_006',
    name: 'Arepa de Choclo con Queso',
    description: 'Arepa dulce de maíz tierno rellena de queso derretido, servida con mantequilla.',
    price: 10000,
    category: 'Entradas',
    image: 'https://via.placeholder.com/300x200/FBBF24/000000?text=Arepa+Choclo',
    rating: 4.3,
    available: true,
  },
  {
    id: 'dish_007',
    name: 'Cazuela de Mariscos',
    description: 'Cazuela cremosa con camarones, calamares, pulpo y pescado en salsa de coco.',
    price: 35000,
    category: 'Platos Fuertes',
    image: 'https://via.placeholder.com/300x200/0EA5E9/FFFFFF?text=Cazuela+Mariscos',
    rating: 4.9,
    available: true,
  },
  {
    id: 'dish_008',
    name: 'Patacones con Hogao',
    description: 'Plátano verde frito y aplastado, cubierto con hogao (salsa de tomate y cebolla).',
    price: 9000,
    category: 'Entradas',
    image: 'https://via.placeholder.com/300x200/78350F/FFFFFF?text=Patacones',
    rating: 4.2,
    available: true,
  },
  {
    id: 'dish_009',
    name: 'Arroz con Pollo',
    description: 'Arroz amarillo cocido con pollo desmenuzado, verduras, cerveza y especias.',
    price: 20000,
    category: 'Platos Fuertes',
    image: 'https://via.placeholder.com/300x200/84CC16/000000?text=Arroz+Pollo',
    rating: 4.5,
    available: true,
  },
  {
    id: 'dish_010',
    name: 'Postre Tres Leches',
    description: 'Bizcocho esponjoso bañado en tres leches (condensada, evaporada y crema), con canela.',
    price: 12000,
    category: 'Postres',
    image: 'https://via.placeholder.com/300x200/EC4899/FFFFFF?text=Tres+Leches',
    rating: 4.8,
    available: true,
  },
  {
    id: 'dish_011',
    name: 'Limonada de Coco',
    description: 'Limonada refrescante con leche de coco, hielo y un toque de azúcar.',
    price: 7000,
    category: 'Bebidas',
    image: 'https://via.placeholder.com/300x200/06B6D4/FFFFFF?text=Limonada+Coco',
    rating: 4.6,
    available: true,
  },
  {
    id: 'dish_012',
    name: 'Jugo de Lulo',
    description: 'Jugo natural de lulo, fruta tropical colombiana, con hielo y sin azúcar añadida.',
    price: 6000,
    category: 'Bebidas',
    image: 'https://via.placeholder.com/300x200/22C55E/FFFFFF?text=Jugo+Lulo',
    rating: 4.4,
    available: true,
  },
];

export const seedMenu = async () => {
  try {
    const batch = db.batch();
    menuItems.forEach((item) => {
      const ref = db.collection('menu').doc(item.id);
      batch.set(ref, item);
    });
    await batch.commit();
    console.log('Menu seeded successfully!');
  } catch (error) {
    console.error('Error seeding menu:', error);
  }
};


export const LOCAL_MENU = menuItems;

export const CATEGORIES = [
  'Todas',
  'Entradas',
  'Sopas',
  'Platos Fuertes',
  'Postres',
  'Bebidas',
];
