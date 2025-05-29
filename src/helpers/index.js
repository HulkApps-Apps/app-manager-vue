/**
 * Calculate plan price details including discounts
 * @param {Object} plan - The plan object containing price and discount information
 * @param {Object|null} promotionalDiscount - Optional promotional discount to apply
 * @returns {Object} - Plan object with calculated price details
 */
export const calculatePlanPriceWithDiscounts = (plan, promotionalDiscount = null) => {
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

export const formatFeatureValue = function(feature) {
  if (!feature) return '';

  if (['double', 'integer'].includes(feature?.value_type)) {
    if (feature.format === 'percentage') {
      return `${feature.value}%`;
    } else if (feature.format === 'count') {
      return (parseInt(feature.value) < 0 ? 'Unlimited' : feature.value);
    } else {
      return feature.value;
    }
  }

  if (feature?.value_type === 'array') {
    let values = [];

    try {
      values = Array.isArray(feature.value) ? feature.value : JSON.parse(feature.value);
    } catch (e) {
      console.error('Invalid array feature value:', feature.value);
      return '';
    }
    return values.join(',')
  }

  if (feature?.value_type === 'string') {
    return feature.value?.replace(/"/g, '') || '';
  }

  return feature.value;
};