// ============================================================================
// AI & Curated Avatar Generation Helper for Salon Services & Staff
// ============================================================================

/**
 * Returns a high-definition AI/curated service avatar photo matching the service name and category
 */
export const getAiServiceAvatar = (serviceName: string = '', category: string = 'Hair'): string => {
  const query = `${serviceName} ${category}`.toLowerCase().trim();

  // 1. Haircuts, Fades & Styling
  if (query.includes('fade') || query.includes('buzz') || query.includes('crew') || query.includes('caesar') || query.includes('undercut')) {
    return 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80';
  }
  if (query.includes('haircut') || query.includes('hair cut') || query.includes('trim') || query.includes('scissor') || query.includes('styling')) {
    return 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80';
  }
  if (query.includes('color') || query.includes('dye') || query.includes('highlight') || query.includes('bleach') || query.includes('balayage')) {
    return 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&auto=format&fit=crop&q=80';
  }
  if (query.includes('wash') || query.includes('shampoo') || query.includes('blow') || query.includes('curls') || query.includes('wave')) {
    return 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80';
  }
  if (query.includes('keratin') || query.includes('straighten') || query.includes('smoothen') || query.includes('hair spa') || query.includes('dandruff')) {
    return 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&auto=format&fit=crop&q=80';
  }

  // 2. Beard Grooming & Shaving
  if (query.includes('beard') || query.includes('mustache') || query.includes('shave') || query.includes('stubble') || category === 'Beard') {
    return 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80';
  }

  // 3. Facials & Skincare
  if (query.includes('facial') || query.includes('skin') || query.includes('glow') || query.includes('tan') || query.includes('bleach') || category === 'Skin') {
    return 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80';
  }

  // 4. Spa, Massages & Relaxation
  if (query.includes('spa') || query.includes('massage') || query.includes('steam') || query.includes('aroma') || query.includes('relax') || category === 'Spa') {
    return 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80';
  }

  // 5. Nails, Manicure & Pedicure
  if (query.includes('manicure') || query.includes('pedicure') || query.includes('nail') || query.includes('feet') || query.includes('hand')) {
    return 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&auto=format&fit=crop&q=80';
  }

  // 6. Packages, Bridal & Groom
  if (query.includes('package') || query.includes('bridal') || query.includes('groom') || query.includes('combo') || query.includes('vip') || category === 'Packages') {
    return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80';
  }

  // 7. Add-Ons & Treatments
  if (query.includes('serum') || query.includes('oil') || query.includes('head') || query.includes('scalp') || query.includes('mask') || category === 'Add-ons') {
    return 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&auto=format&fit=crop&q=80';
  }

  return 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80';
};

/**
 * Returns a high-definition AI/curated stylist avatar photo matching the stylist name and role
 */
export const getAiStylistAvatar = (stylistName: string = '', role: string = 'Master Stylist'): string => {
  const curatedAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80'
  ];

  if (!stylistName || stylistName.trim() === '') {
    return curatedAvatars[0];
  }

  // Consistent deterministic hash mapping based on name
  let hash = 0;
  for (let i = 0; i < stylistName.length; i++) {
    hash = stylistName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % curatedAvatars.length;
  return curatedAvatars[index];
};
