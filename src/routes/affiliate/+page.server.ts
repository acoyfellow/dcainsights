import { getAffiliatePartners } from '$lib/server/affiliate';
import type { AffiliatePartner } from '$lib/types';

export const load = async (): Promise<{ partners: AffiliatePartner[] }> => {
  const partners = getAffiliatePartners();
  return { partners };
};
