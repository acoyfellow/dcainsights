import { json, error } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';
import type { RequestHandler } from './$types';

// Free tier: 1000 calls/month
// Developer tier: 100000 calls/month
// Enterprise: unlimited

export const GET: RequestHandler = async ({ request, url }) => {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    // Check authentication and tier
    let tier = 'free';
    if (token) {
      const session = await validateSession(token);
      if (session) {
        tier = session.tier;
      }
    }
    
    // Get parameters
    const amount = url.searchParams.get('amount');
    const interval = url.searchParams.get('interval') || 'monthly';
    const startDate = url.searchParams.get('start');
    const endDate = url.searchParams.get('end');
    
    if (!amount) {
      throw error(400, 'Missing required parameter: amount');
    }
    
    const investmentAmount = parseFloat(amount);
    if (isNaN(investmentAmount) || investmentAmount <= 0) {
      throw error(400, 'Invalid investment amount');
    }
    
    // Load historical data (simplified - in production, use actual data)
    const result = {
      investmentAmount,
      interval,
      startDate: startDate || '2012-02-01',
      endDate: endDate || new Date().toISOString().split('T')[0],
      totalInvested: 0,
      finalValue: 0,
      totalReturn: 0,
      returnPercentage: 0,
      sharesAccumulated: 0,
      averageCost: 0,
      calculations: [] as any[]
    };
    
    // Simplified calculation (actual implementation would use real data)
    const monthlyReturn = 0.007; // ~8.4% annual return
    const months = 12;
    
    let shares = 0;
    let totalInvested = 0;
    
    for (let i = 0; i < months; i++) {
      const price = 1400 * Math.pow(1 + monthlyReturn, i);
      const newShares = investmentAmount / price;
      shares += newShares;
      totalInvested += investmentAmount;
      
      result.calculations.push({
        month: i + 1,
        price,
        sharesBought: newShares,
        totalShares: shares,
        totalInvested
      });
    }
    
    const finalPrice = result.calculations[result.calculations.length - 1].price;
    result.totalInvested = totalInvested;
    result.sharesAccumulated = shares;
    result.finalValue = shares * finalPrice;
    result.totalReturn = result.finalValue - totalInvested;
    result.returnPercentage = (result.totalReturn / totalInvested) * 100;
    result.averageCost = totalInvested / shares;
    
    return json(result, {
      headers: {
        'X-RateLimit-Limit': tier === 'free' ? '1000' : tier === 'developer' ? '100000' : 'unlimited',
        'X-RateLimit-Remaining': '999',
        'X-Tier': tier
      }
    });
  } catch (err) {
    if (err instanceof Error && 'status' in err) {
      throw err;
    }
    throw error(500, 'Calculation failed');
  }
};
