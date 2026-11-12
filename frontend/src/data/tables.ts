import { Table } from '../types';

export const TABLES: Table[] = [
  ...Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    label: `Mesa ${i + 1}`,
    zone: 'interior' as const,
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `T${i + 1}`,
    label: `Terraza ${i + 1}`,
    zone: 'terraza' as const,
  })),
];

export const getTableLabel = (tableId: string | number): string => {
  const table = TABLES.find(t => t.id === tableId || String(t.id) === String(tableId));
  return table?.label || String(tableId);
};
