export const PLAN_MONTHS = {
  MONTHLY: 1,
  QUARTERLY: 3,
  HALF_YEARLY: 6,
  YEARLY: 12,
} as const;

export function calculateExpiryDate(
  joinDate: Date,
  plan: keyof typeof PLAN_MONTHS,
) {
  const expiryDate = new Date(joinDate);

  expiryDate.setMonth(expiryDate.getMonth() + PLAN_MONTHS[plan]);

  return expiryDate;
}
