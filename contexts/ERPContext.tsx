import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/template';
import { erpService } from '@/services/erpService';
import type { 
  Material, 
  ProductionOrder, 
  QualityInspection, 
  Supplier,
  DashboardStats 
} from '@/types/erp';

interface ERPContextType {
  // State
  materials: Material[];
  productionOrders: any[];
  qualityInspections: QualityInspection[];
  suppliers: Supplier[];
  dashboardStats: DashboardStats | null;
  loading: boolean;
  
  // Materials
  addMaterial: (material: Omit<Material, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<{ error: any }>;
  updateMaterial: (id: string, updates: Partial<Material>) => Promise<{ error: any }>;
  deleteMaterial: (id: string) => Promise<{ error: any }>;
  
  // Production Orders
  addProductionOrder: (order: Omit<ProductionOrder, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<{ error: any }>;
  updateProductionOrder: (id: string, updates: Partial<ProductionOrder>) => Promise<{ error: any }>;
  
  // Quality Inspections
  addQualityInspection: (inspection: Omit<QualityInspection, 'id' | 'user_id' | 'created_at'>) => Promise<{ error: any }>;
  
  // Suppliers
  addSupplier: (supplier: Omit<Supplier, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<{ error: any }>;
  
  // Refresh
  refreshData: () => Promise<void>;
}

export const ERPContext = createContext<ERPContextType | undefined>(undefined);

export function ERPProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [productionOrders, setProductionOrders] = useState<any[]>([]);
  const [qualityInspections, setQualityInspections] = useState<QualityInspection[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) {
      setMaterials([]);
      setProductionOrders([]);
      setQualityInspections([]);
      setSuppliers([]);
      setDashboardStats(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const [materialsRes, ordersRes, inspectionsRes, suppliersRes, statsRes] = await Promise.all([
      erpService.getMaterials(),
      erpService.getProductionOrders(),
      erpService.getQualityInspections(),
      erpService.getSuppliers(),
      erpService.getDashboardStats(),
    ]);

    if (materialsRes.data) setMaterials(materialsRes.data);
    if (ordersRes.data) setProductionOrders(ordersRes.data);
    if (inspectionsRes.data) setQualityInspections(inspectionsRes.data);
    if (suppliersRes.data) setSuppliers(suppliersRes.data);
    if (statsRes.data) setDashboardStats(statsRes.data);
    
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const addMaterial = async (material: Omit<Material, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await erpService.createMaterial(material);
    if (data) {
      setMaterials(prev => [...prev, data]);
      await erpService.getDashboardStats().then(res => res.data && setDashboardStats(res.data));
    }
    return { error };
  };

  const updateMaterial = async (id: string, updates: Partial<Material>) => {
    const { data, error } = await erpService.updateMaterial(id, updates);
    if (data) {
      setMaterials(prev => prev.map(m => m.id === id ? data : m));
    }
    return { error };
  };

  const deleteMaterial = async (id: string) => {
    const { error } = await erpService.deleteMaterial(id);
    if (!error) {
      setMaterials(prev => prev.filter(m => m.id !== id));
    }
    return { error };
  };

  const addProductionOrder = async (order: Omit<ProductionOrder, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await erpService.createProductionOrder(order);
    if (data) {
      await loadData();
    }
    return { error };
  };

  const updateProductionOrder = async (id: string, updates: Partial<ProductionOrder>) => {
    const { data, error } = await erpService.updateProductionOrder(id, updates);
    if (data) {
      await loadData();
    }
    return { error };
  };

  const addQualityInspection = async (inspection: Omit<QualityInspection, 'id' | 'user_id' | 'created_at'>) => {
    const { data, error } = await erpService.createQualityInspection(inspection);
    if (data) {
      setQualityInspections(prev => [data, ...prev]);
      await erpService.getDashboardStats().then(res => res.data && setDashboardStats(res.data));
    }
    return { error };
  };

  const addSupplier = async (supplier: Omit<Supplier, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await erpService.createSupplier(supplier);
    if (data) {
      setSuppliers(prev => [...prev, data]);
    }
    return { error };
  };

  return (
    <ERPContext.Provider
      value={{
        materials,
        productionOrders,
        qualityInspections,
        suppliers,
        dashboardStats,
        loading,
        addMaterial,
        updateMaterial,
        deleteMaterial,
        addProductionOrder,
        updateProductionOrder,
        addQualityInspection,
        addSupplier,
        refreshData: loadData,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
}