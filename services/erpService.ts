import { getSupabaseClient } from '@/template';
import type { 
  Material, 
  ProductionOrder, 
  QualityInspection, 
  Supplier,
  CostEntry,
  DashboardStats 
} from '@/types/erp';

const supabase = getSupabaseClient();

export const erpService = {
  // ==================== MATERIALS ====================
  async getMaterials() {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    return { data: data as Material[] | null, error };
  },

  async createMaterial(material: Omit<Material, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('materials')
      .insert({ ...material, user_id: user.id })
      .select()
      .single();
    
    return { data: data as Material | null, error };
  },

  async updateMaterial(id: string, updates: Partial<Material>) {
    const { data, error } = await supabase
      .from('materials')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    return { data: data as Material | null, error };
  },

  async deleteMaterial(id: string) {
    const { error } = await supabase
      .from('materials')
      .delete()
      .eq('id', id);
    
    return { error };
  },

  // ==================== PRODUCTION ORDERS ====================
  async getProductionOrders() {
    const { data, error } = await supabase
      .from('production_orders')
      .select(`
        *,
        product:materials!production_orders_product_id_fkey(name, unit)
      `)
      .order('created_at', { ascending: false });
    
    return { data: data as any[] | null, error };
  },

  async createProductionOrder(order: Omit<ProductionOrder, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('production_orders')
      .insert({ ...order, user_id: user.id })
      .select()
      .single();
    
    return { data: data as ProductionOrder | null, error };
  },

  async updateProductionOrder(id: string, updates: Partial<ProductionOrder>) {
    const { data, error } = await supabase
      .from('production_orders')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    return { data: data as ProductionOrder | null, error };
  },

  // ==================== QUALITY INSPECTIONS ====================
  async getQualityInspections() {
    const { data, error } = await supabase
      .from('quality_inspections')
      .select('*')
      .order('inspection_date', { ascending: false });
    
    return { data: data as QualityInspection[] | null, error };
  },

  async createQualityInspection(inspection: Omit<QualityInspection, 'id' | 'user_id' | 'created_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('quality_inspections')
      .insert({ ...inspection, user_id: user.id })
      .select()
      .single();
    
    return { data: data as QualityInspection | null, error };
  },

  // ==================== SUPPLIERS ====================
  async getSuppliers() {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    return { data: data as Supplier[] | null, error };
  },

  async createSupplier(supplier: Omit<Supplier, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('suppliers')
      .insert({ ...supplier, user_id: user.id })
      .select()
      .single();
    
    return { data: data as Supplier | null, error };
  },

  // ==================== COSTS ====================
  async getCostEntries() {
    const { data, error } = await supabase
      .from('cost_entries')
      .select(`
        *,
        category:cost_categories(name, type)
      `)
      .order('entry_date', { ascending: false });
    
    return { data: data as any[] | null, error };
  },

  async createCostEntry(entry: Omit<CostEntry, 'id' | 'user_id' | 'created_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('cost_entries')
      .insert({ ...entry, user_id: user.id })
      .select()
      .single();
    
    return { data: data as CostEntry | null, error };
  },

  // ==================== DASHBOARD STATS ====================
  async getDashboardStats(): Promise<{ data: DashboardStats | null, error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };

    const today = new Date().toISOString().split('T')[0];

    const [orders, materials, inspections, suppliers, costs] = await Promise.all([
      supabase.from('production_orders').select('status, created_at').eq('user_id', user.id),
      supabase.from('materials').select('stock_quantity, min_stock').eq('user_id', user.id).eq('is_active', true),
      supabase.from('quality_inspections').select('status').eq('user_id', user.id),
      supabase.from('suppliers').select('is_active').eq('user_id', user.id).eq('is_active', true),
      supabase.from('cost_entries').select('amount').eq('user_id', user.id),
    ]);

    const stats: DashboardStats = {
      activeOrders: orders.data?.filter(o => o.status === 'in_progress').length || 0,
      pendingOrders: orders.data?.filter(o => o.status === 'pending').length || 0,
      completedToday: orders.data?.filter(o => 
        o.status === 'completed' && o.created_at.startsWith(today)
      ).length || 0,
      lowStockItems: materials.data?.filter(m => m.stock_quantity <= m.min_stock).length || 0,
      totalRevenue: 0,
      totalCosts: costs.data?.reduce((sum, c) => sum + Number(c.amount), 0) || 0,
      qualityApprovalRate: inspections.data?.length 
        ? (inspections.data.filter(i => i.status === 'approved').length / inspections.data.length) * 100 
        : 100,
      activeSuppliers: suppliers.data?.length || 0,
    };

    return { data: stats, error: null };
  },
};