export function calculateImpactFromOrderItems(items) {
  let plasticSavedGrams = 0;
  let carbonSavedGrams = 0;
  let locallySourcedCount = 0;

  for (const item of items) {
    const plastic = item.product?.plastic_saved_grams || item.plastic_saved_grams || 0;
    const carbon = item.product?.carbon_saved_grams || item.carbon_saved_grams || 0;
    const locally = item.product?.locally_sourced || item.locally_sourced || false;

    plasticSavedGrams += plastic * item.quantity;
    carbonSavedGrams += carbon * item.quantity;
    if (locally) {
      locallySourcedCount += item.quantity;
    }
  }

  const plastic_saved_kg = Number((plasticSavedGrams / 1000).toFixed(3));
  const carbon_saved_kg = Number((carbonSavedGrams / 1000).toFixed(3));

  return {
    plastic_saved_kg,
    carbon_saved_kg,
    locally_sourced_count: locallySourcedCount
  };
}

