export function isPromoActive(promo?: {
  startAt?: Date | string;
  expiredAt?: Date | string;
}) {
  if (!promo?.startAt || !promo?.expiredAt) return false;
  const now = new Date();
  const start = new Date(promo.startAt);
  const end = new Date(promo.expiredAt);
  return now >= start && now <= end;
}
