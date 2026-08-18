// Single source of truth for circular-economy impact estimates.
export const CO2_KG_PER_BOOK = 3; // kg CO₂ avoided per reused book
export const KG_CO2_PER_CAR_KM = 0.12; // average car: 120 g CO₂ / km
export const KG_CO2_PER_TREE_ICON = 22; // 1 tree icon ≈ 22 kg CO₂ / year

export const co2FromBooks = (books: number) => books * CO2_KG_PER_BOOK;
export const carKmFromCo2 = (kg: number) => Math.round(kg / KG_CO2_PER_CAR_KM);
export const treeCountFromCo2 = (kg: number) => Math.floor(kg / KG_CO2_PER_TREE_ICON);

export const impactFromBooks = (books: number) => {
  const co2 = co2FromBooks(books);
  return {
    books,
    co2,
    carKm: carKmFromCo2(co2),
    trees: treeCountFromCo2(co2),
  };
};
