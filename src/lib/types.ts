export interface DevicePrice {
  id: string;
  brand: string;
  model: string;
  part_type: string;
  original_part: number;
  aftermarket_part: number;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface RepairOption {
  id: string;
  name: string;
  value: string;
  dbValue: string;
}

export interface RepairRequest {
  model: string;
  repairType: string;
  serviceType: 'original' | 'aftermarket' | 'onsite';
  price: number;
  location: Location;
  estimatedTime: string;
  warranty?: boolean;
  onsitePartType?: 'original' | 'aftermarket';
}

export interface RepairOrder {
  id: string;
  user_id: string;
  model: string;
  repair_type: string;
  service_type: string;
  price: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  technician_id: string | null;
  created_at: string;
  updated_at: string;
  warranty: boolean;
  onsite_part_type?: 'original' | 'aftermarket';
}

export interface UserProfile {
  id: string;
  phone: string;
  created_at: string;
  updated_at: string;
}