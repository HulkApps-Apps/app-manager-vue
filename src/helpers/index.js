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

export const formatFeature = function(feature) {
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

/**
 * Check if the given plan is the current active plan.
 * This returns true only when there is an active charge, a currentPlan exists,
 * and the plan either matches the currentPlan id or (for non-custom plans)
 * its base_plan matches the currentPlan id. Ensures "current" is tied to an active charge.
 */
export const isCurrentPlan = function(plan, currentPlan, hasActiveCharge = false) {
  return hasActiveCharge
    && currentPlan
    && (
      currentPlan.id === plan.id
      || (
        !plan.is_custom
          && plan.base_plan === currentPlan.id
        )
    );
}

export const isSamePlanInOtherInterval = function (shopifyPlan, plan, currentPlan) {
  return currentPlan && (plan.shopify_plans === shopifyPlan)
}

export const isPlanButtonDisabled = function (shopifyPlan, plan, currentPlan, hasActiveCharge = false) {
  if (isCurrentPlan(plan, currentPlan, hasActiveCharge)) {
    return true;
  }

  return !!(plan.store_base_plan && !plan.shopify_plans.includes(shopifyPlan));
}

export const getPlanButtonText = function (shopifyPlan, plan, translateMe, currentPlan, isPlanTable = false, hasActiveCharge = false) {
  const isCurrentPlanFlag = isCurrentPlan(plan, currentPlan, hasActiveCharge);
  if (isCurrentPlanFlag) {
    return translateMe("Selected plan");
  }

  if (plan.store_base_plan && !plan.shopify_plans.includes(shopifyPlan)) {
    return translateMe("Not applicable");
  }

  if (isCurrentPlanFlag) {
    return plan.price > currentPlan.price
      ? translateMe("Upgrade")
      : isPlanTable
        ? translateMe("Switch to this plan")
        : translateMe("Choose plan");
  }

  return translateMe("Choose plan");
}

/**
 * Determine whether to show a store-base plan note below the plan.
 * Only applicable for store-base plans (`plan.store_base_plan`).
 * The note is shown when:
 * - a `currentPlan` exists,
 * - the `shopifyPlan` is listed in `plan.shopify_plans`,
 * - the plan is not the current active plan,
 * - and the plan is not the same plan in another interval.
 *
 * Use this to display the following note below the plan:
 * Note: On account of your recent Shopify plan upgrade, you should consider upgrading your current app plan
 */
export const isPlanNote = function(shopifyPlan, plan, currentPlan, hasActiveCharge) {
  return !!(plan.store_base_plan
    && currentPlan
    && plan.shopify_plans.includes(shopifyPlan)
    && !isCurrentPlan(plan, currentPlan, hasActiveCharge)
    && !isSamePlanInOtherInterval(shopifyPlan, plan, currentPlan));
}