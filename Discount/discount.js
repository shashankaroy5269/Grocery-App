
export const getDiscount = (total) => {
  if (total >= 500) return total * 0.2;
  if (total >= 300) return total * 0.15;
  if (total >= 200) return total * 0.1;
  return 0;
};

export const applyCoupon = (code, total) => {
  if (!code) return 0;
const coupons = {
    SAVE10: 0.1,   
    SAVE20: 0.2,   
    SUPER30: 0.3,  
        
  };

const upperCode = code.toUpperCase();
if (["SAVE10", "SAVE20", "SUPER30"].includes(upperCode)) {
    return total * coupons[upperCode];
  }

if (upperCode === "FLAT50") {
    return coupons[upperCode];
  }

  return 0;
};

export const calculateFinalPrice = (total, couponCode) => {
  const discount = getDiscount(total);

  const afterDiscountTotal = total - discount;

  const couponDiscount = applyCoupon(couponCode, afterDiscountTotal);

  const final = afterDiscountTotal - couponDiscount;

  return {
    total,
    discount,
    couponDiscount,
    final: Math.max(0, final),
  };
};