import { affiliatePartnersData, type AffiliatePartner } from '$lib/types';

// Affiliate click tracking
interface AffiliateClick {
  partnerId: string;
  userId?: string;
  timestamp: number;
  source: string;
  converted: boolean;
}

// Commission tracking
interface AffiliateCommission {
  id: string;
  partnerId: string;
  userId: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  createdAt: number;
  paidAt?: number;
}

// Commission storage
const commissions: Map<string, AffiliateCommission> = new Map();

// Click tracking
const clicks: AffiliateClick[] = [];

// Generate affiliate link
export function generateAffiliateLink(partnerId: string, userId?: string, source: string = 'dca-insights'): string {
  const partner = affiliatePartnersData.find(p => p.id === partnerId);
  if (!partner) return '';

  const baseUrl = partner.url;
  const affiliateCode = `dcainsights-${userId || 'ref'}`;

  // Check if URL already has query parameters
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}ref=${affiliateCode}&source=${source}`;
}

// Track affiliate click
export function trackAffiliateClick(partnerId: string, userId?: string, source: string = 'dca-insights'): void {
  clicks.push({
    partnerId,
    userId,
    timestamp: Date.now(),
    source,
    converted: false
  });
}

// Record commission
export function recordCommission(partnerId: string, userId: string, amount: number): string {
  const commissionId = `comm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const commission: AffiliateCommission = {
    id: commissionId,
    partnerId,
    userId,
    amount,
    status: 'pending',
    createdAt: Date.now()
  };

  commissions.set(commissionId, commission);
  return commissionId;
}

// Get all affiliate partners
export function getAffiliatePartners(): AffiliatePartner[] {
  return affiliatePartnersData.filter(p => p.status === 'active');
}

// Get partner by ID
export function getAffiliatePartner(id: string): AffiliatePartner | null {
  return affiliatePartnersData.find(p => p.id === id) || null;
}

// Get user's affiliate earnings
export function getUserAffiliateEarnings(userId: string): {
  totalEarned: number;
  pending: number;
  approved: number;
  paid: number;
} {
  let totalEarned = 0;
  let pending = 0;
  let approved = 0;
  let paid = 0;

  for (const commission of commissions.values()) {
    if (commission.userId === userId) {
      totalEarned += commission.amount;
      switch (commission.status) {
        case 'pending':
          pending += commission.amount;
          break;
        case 'approved':
          approved += commission.amount;
          break;
        case 'paid':
          paid += commission.amount;
          break;
      }
    }
  }

  return { totalEarned, pending, approved, paid };
}

// Get commission history
export function getUserCommissionHistory(userId: string): AffiliateCommission[] {
  return Array.from(commissions.values())
    .filter(c => c.userId === userId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

// Get conversion rate
export function getConversionRate(partnerId: string): number {
  const partnerClicks = clicks.filter(c => c.partnerId === partnerId);
  if (partnerClicks.length === 0) return 0;

  const converted = partnerClicks.filter(c => c.converted).length;
  return (converted / partnerClicks.length) * 100;
}

// Mark click as converted
export function markAsConverted(partnerId: string, userId: string, amount: number): void {
  // Update click record
  const click = clicks.find(c => c.partnerId === partnerId && c.userId === userId && !c.converted);
  if (click) {
    click.converted = true;
  }

  // Record commission
  const partner = affiliatePartnersData.find(p => p.id === partnerId);
  if (partner) {
    const commissionAmount = (amount * partner.commission) / 100;
    recordCommission(partnerId, userId, commissionAmount);
  }
}

// Approve commission
export function approveCommission(commissionId: string): void {
  const commission = commissions.get(commissionId);
  if (commission && commission.status === 'pending') {
    commission.status = 'approved';
  }
}

// Pay out commission
export function payoutCommission(commissionId: string): void {
  const commission = commissions.get(commissionId);
  if (commission && commission.status === 'approved') {
    commission.status = 'paid';
    commission.paidAt = Date.now();
  }
}

// Reject commission
export function rejectCommission(commissionId: string): void {
  const commission = commissions.get(commissionId);
  if (commission && commission.status === 'pending') {
    commission.status = 'rejected';
  }
}

// Get affiliate stats
export function getAffiliateStats(): {
  totalClicks: number;
  totalConversions: number;
  totalCommissions: number;
  topPartners: { partner: AffiliatePartner; clicks: number; conversions: number }[];
} {
  const totalClicks = clicks.length;
  const totalConversions = clicks.filter(c => c.converted).length;
  const totalCommissions = Array.from(commissions.values())
    .reduce((sum, c) => sum + c.amount, 0);

  const topPartners = affiliatePartnersData
    .map(partner => {
      const partnerClicks = clicks.filter(c => c.partnerId === partner.id);
      const partnerConversions = partnerClicks.filter(c => c.converted).length;
      return {
        partner,
        clicks: partnerClicks.length,
        conversions: partnerConversions
      };
    })
    .sort((a, b) => b.clicks - a.clicks);

  return {
    totalClicks,
    totalConversions,
    totalCommissions,
    topPartners
  };
}
