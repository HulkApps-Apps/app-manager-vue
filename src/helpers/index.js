/**
 * Calculate plan price details including discounts
 * @param {Object} plan - The plan object containing price and discount information
 * @param {Object|null} promotionalDiscount - Optional promotional discount to apply
 * @returns {Object} - Plan object with calculated price details
 */
export const getPlanPriceDetails = (plan, promotionalDiscount = null) => {
  const originalPrice = plan.price;
  let finalPrice = originalPrice;
  let hasDiscount = false;

  // Apply promotional discount if available
  if (
      promotionalDiscount?.value > 0
      && promotionalDiscount.plan_relation.includes(plan.id)
  ) {
    hasDiscount = true;
    finalPrice = promotionalDiscount.type === 'percentage'
      ? originalPrice - (originalPrice * promotionalDiscount.value) / 100
      : Math.max(0, originalPrice - promotionalDiscount.value);

  // Otherwise, apply plan's own discount
  } else if (plan.discount > 0) {
    hasDiscount = true;
    finalPrice = plan.discount_type === 'percentage'
      ? originalPrice - (originalPrice * plan.discount) / 100
      : Math.max(0, originalPrice - plan.discount);
  }

  return {
    ...plan,
    price: parseFloat(finalPrice.toFixed(2)),
    strike_price: hasDiscount ? parseFloat(originalPrice.toFixed(2)) : null,
    has_discount: hasDiscount
  };
}; 