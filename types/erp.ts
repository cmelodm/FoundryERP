export interface Material {
  id: string;
  user_id: string;
  code: string;
  name: string;
  type: 'raw_material' | 'finished_product' | 'consumable';
  unit: string;
  unit_cost: number;
  stock_quantity: number;
  min_stock: number;
  max_stock?: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: string;
  user_id: string;
  material_id: string;
  movement_type: 'in' | 'out' | 'adjustment';
  quantity: number;
  unit_cost?: number;
  reference_type?: string;
  reference_id?: string;
  notes?: string;
  created_at: string;
}

export interface ProductionOrder {
  id: string;
  user_id: string;
  order_number: string;
  product_id: string;
  quantity: number;
  unit: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  start_date?: string;
  expected_end_date?: string;
  actual_end_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductionMaterial {
  id: string;
  production_order_id: string;
  material_id: string;
  planned_quantity: number;
  actual_quantity?: number;
  unit_cost?: number;
  created_at: string;
}

export interface QualityInspection {
  id: string;
  user_id: string;
  production_order_id?: string;
  material_id?: string;
  inspection_type: 'incoming' | 'in_process' | 'final' | 'audit';
  status: 'approved' | 'rejected' | 'conditional';
  inspector_name: string;
  inspection_date: string;
  notes?: string;
  defects_found?: string;
  corrective_actions?: string;
  created_at: string;
}

export interface Supplier {
  id: string;
  user_id: string;
  code: string;
  name: string;
  contact_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  rating?: number;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CostCategory {
  id: string;
  user_id: string;
  name: string;
  type: 'direct' | 'indirect' | 'overhead';
  is_active: boolean;
  created_at: string;
}

export interface CostEntry {
  id: string;
  user_id: string;
  category_id: string;
  production_order_id?: string;
  amount: number;
  description: string;
  entry_date: string;
  created_at: string;
}

export interface DashboardStats {
  activeOrders: number;
  pendingOrders: number;
  completedToday: number;
  lowStockItems: number;
  totalRevenue: number;
  totalCosts: number;
  qualityApprovalRate: number;
  activeSuppliers: number;
}