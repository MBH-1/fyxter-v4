// ============================================
// PRICING TABLE QUERY FUNCTIONS
// ============================================

import { supabase } from './supabase';

// TypeScript interfaces
export interface PricingOption {
  id: string;
  device_category: string;
  device_model: string;
  repair_type: string;
  repair_option: string | null;
  price: number;
  warranty_months: number;
  includes_expert_technician: boolean;
  is_most_popular: boolean;
  created_at: string;
  updated_at: string;
}

export interface RepairTypeGroup {
  repairType: string;
  options: PricingOption[];
}

// ============================================
// EXAMPLE 1: Get all pricing options for a specific device and repair type
// ============================================

export async function getPricingOptions(
  deviceModel: string, 
  repairType: string
): Promise<PricingOption[] | null> {
  const { data, error } = await supabase
    .from('pricing')
    .select('*')
    .eq('device_model', deviceModel)
    .eq('repair_type', repairType)
    .order('price', { ascending: true });

  if (error) {
    console.error('Error fetching pricing:', error);
    return null;
  }

  return data;
}

// Usage:
// const screenOptions = await getPricingOptions('Google Pixel 5A 5G', 'Broken Screen');
// Returns array of pricing options sorted by price


// ============================================
// EXAMPLE 2: Get specific repair option price
// ============================================

export async function getSpecificPrice(
  deviceModel: string, 
  repairType: string, 
  repairOption: string
): Promise<{ price: number; warranty_months: number } | null> {
  const { data, error } = await supabase
    .from('pricing')
    .select('price, warranty_months')
    .eq('device_model', deviceModel)
    .eq('repair_type', repairType)
    .eq('repair_option', repairOption)
    .single();

  if (error) {
    console.error('Error:', error);
    return null;
  }

  return data;
}

// Usage:
// const originalScreenPrice = await getSpecificPrice('Google Pixel 5A 5G', 'Broken Screen', 'Original');


// ============================================
// EXAMPLE 3: Get all repair types available for a device
// ============================================

export async function getAllRepairsForDevice(
  deviceModel: string
): Promise<Record<string, PricingOption[]> | null> {
  const { data, error } = await supabase
    .from('pricing')
    .select('repair_type, repair_option, price, is_most_popular, warranty_months, id')
    .eq('device_model', deviceModel)
    .order('repair_type', { ascending: true })
    .order('price', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return null;
  }

  // Group by repair type
  const grouped = data.reduce((acc, item) => {
    if (!acc[item.repair_type]) {
      acc[item.repair_type] = [];
    }
    acc[item.repair_type].push(item as PricingOption);
    return acc;
  }, {} as Record<string, PricingOption[]>);

  return grouped;
}

// Usage:
// const allRepairs = await getAllRepairsForDevice('Google Pixel 5A 5G');
// Returns object grouped by repair type


// ============================================
// EXAMPLE 4: Get most popular option for a repair type
// ============================================

export async function getMostPopularOption(
  deviceModel: string, 
  repairType: string
): Promise<PricingOption | null> {
  const { data, error } = await supabase
    .from('pricing')
    .select('*')
    .eq('device_model', deviceModel)
    .eq('repair_type', repairType)
    .eq('is_most_popular', true)
    .single();

  if (error) {
    console.error('Error:', error);
    return null;
  }

  return data;
}

// Usage:
// const popularOption = await getMostPopularOption('Google Pixel 5A 5G', 'Broken Screen');


// ============================================
// EXAMPLE 5: Get all devices by category
// ============================================

export async function getDevicesByCategory(
  category: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from('pricing')
    .select('device_model')
    .eq('device_category', category)
    .order('device_model', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return [];
  }

  // Get unique models
  const uniqueModels = [...new Set(data.map(item => item.device_model))];
  return uniqueModels;
}

// Usage:
// const googleDevices = await getDevicesByCategory('Google');


// ============================================
// EXAMPLE 6: Get all unique repair types
// ============================================

export async function getAllRepairTypes(): Promise<string[]> {
  const { data, error } = await supabase
    .from('pricing')
    .select('repair_type')
    .order('repair_type', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return [];
  }

  // Get unique repair types
  const uniqueTypes = [...new Set(data.map(item => item.repair_type))];
  return uniqueTypes;
}

// Usage:
// const repairTypes = await getAllRepairTypes();
// Returns: ['Battery Issues', 'Broken Screen', 'Camera Problems', ...]


// ============================================
// EXAMPLE 7: Search for devices
// ============================================

export async function searchDevices(
  searchTerm: string
): Promise<Array<{ category: string; model: string }>> {
  const { data, error } = await supabase
    .from('pricing')
    .select('device_category, device_model')
    .ilike('device_model', `%${searchTerm}%`);

  if (error) {
    console.error('Error:', error);
    return [];
  }

  // Get unique models
  const seen = new Set<string>();
  const uniqueModels = data
    .filter(item => {
      const key = `${item.device_category}-${item.device_model}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map(item => ({
      category: item.device_category,
      model: item.device_model
    }));
  
  return uniqueModels;
}

// Usage:
// const pixelDevices = await searchDevices('Pixel 5');


// ============================================
// EXAMPLE 8: Get complete repair flow for a device
// ============================================

export async function getCompleteRepairFlow(
  deviceModel: string
): Promise<RepairTypeGroup[] | null> {
  // Step 1: Get all repair types for this device
  const { data: repairs, error } = await supabase
    .from('pricing')
    .select('repair_type')
    .eq('device_model', deviceModel);

  if (error) {
    console.error('Error:', error);
    return null;
  }

  // Get unique repair types
  const repairTypes = [...new Set(repairs.map(r => r.repair_type))];

  // Step 2: For each repair type, get all options
  const repairDetails = await Promise.all(
    repairTypes.map(async (repairType) => {
      const { data: options } = await supabase
        .from('pricing')
        .select('*')
        .eq('device_model', deviceModel)
        .eq('repair_type', repairType)
        .order('price', { ascending: true });

      return {
        repairType,
        options: options || []
      };
    })
  );

  return repairDetails;
}

// Usage:
// const completeFlow = await getCompleteRepairFlow('Google Pixel 5A 5G');


// ============================================
// EXAMPLE 9: Get price by option name (for your existing flow)
// This matches your current getSelectedPrice() logic
// ============================================

export async function getPriceByOption(
  deviceModel: string,
  repairType: string,
  optionName: 'Aftermarket' | 'Original' | 'Home Service' | 'Diagnostic' | string
): Promise<number> {
  const { data, error } = await supabase
    .from('pricing')
    .select('price')
    .eq('device_model', deviceModel)
    .eq('repair_type', repairType)
    .eq('repair_option', optionName)
    .single();

  if (error) {
    console.error('Error fetching price:', error);
    return 0;
  }

  return data?.price || 0;
}

// Usage:
// const price = await getPriceByOption('iPhone 14', 'Broken Screen', 'Original');


// ============================================
// EXAMPLE 10: Get all categories
// ============================================

export async function getAllCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('pricing')
    .select('device_category')
    .order('device_category', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return [];
  }

  // Get unique categories
  const uniqueCategories = [...new Set(data.map(item => item.device_category))];
  return uniqueCategories;
}

// Usage:
// const categories = await getAllCategories();
// Returns: ['Google', 'Ipad', 'Iphone', 'Samsung']
