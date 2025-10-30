import { useContext } from 'react';
import { ERPContext } from '@/contexts/ERPContext';

export function useERP() {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within ERPProvider');
  }
  return context;
}