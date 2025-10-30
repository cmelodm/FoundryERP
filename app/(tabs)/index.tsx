import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useERP } from '@/hooks/useERP';
import { colors } from '@/constants/colors';

const { width } = Dimensions.get('window');
const cardWidth = width > 768 ? (width - 72) / 2 : width - 48;

export default function DashboardScreen() {
  const { dashboardStats, loading, refreshData } = useERP();

  useEffect(() => {
    refreshData();
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color, 
    unit = '' 
  }: { 
    title: string; 
    value: number | string; 
    icon: string; 
    color: string;
    unit?: string;
  }) => (
    <View style={[styles.statCard, { width: cardWidth }]}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <MaterialIcons name={icon as any} size={32} color={color} />
      </View>
      <Text style={styles.statValue}>
        {typeof value === 'number' ? value : value}{unit}
      </Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refreshData} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Visão Geral</Text>
        <Text style={styles.headerSubtitle}>
          Acompanhe os indicadores da sua fundição
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Ordens em Produção"
          value={dashboardStats?.activeOrders || 0}
          icon="build"
          color={colors.primary[600]}
        />
        <StatCard
          title="Ordens Pendentes"
          value={dashboardStats?.pendingOrders || 0}
          icon="pending"
          color={colors.warning}
        />
        <StatCard
          title="Concluídas Hoje"
          value={dashboardStats?.completedToday || 0}
          icon="check-circle"
          color={colors.success}
        />
        <StatCard
          title="Estoque Baixo"
          value={dashboardStats?.lowStockItems || 0}
          icon="warning"
          color={colors.error}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Qualidade</Text>
        <View style={styles.qualityCard}>
          <View style={styles.qualityInfo}>
            <MaterialIcons name="verified" size={48} color={colors.success} />
            <View style={styles.qualityText}>
              <Text style={styles.qualityValue}>
                {dashboardStats?.qualityApprovalRate.toFixed(1) || 100}%
              </Text>
              <Text style={styles.qualityLabel}>Taxa de Aprovação</Text>
            </View>
          </View>
          <View style={styles.qualityBar}>
            <View 
              style={[
                styles.qualityBarFill, 
                { width: `${dashboardStats?.qualityApprovalRate || 100}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custos Totais</Text>
        <View style={styles.costCard}>
          <MaterialIcons name="attach-money" size={32} color={colors.primary[600]} />
          <Text style={styles.costValue}>
            R$ {(dashboardStats?.totalCosts || 0).toLocaleString('pt-BR', { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
            })}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fornecedores Ativos</Text>
        <View style={styles.supplierCard}>
          <MaterialIcons name="local-shipping" size={32} color={colors.primary[600]} />
          <Text style={styles.supplierValue}>
            {dashboardStats?.activeSuppliers || 0}
          </Text>
          <Text style={styles.supplierLabel}>Fornecedores Cadastrados</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  qualityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  qualityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  qualityText: {
    marginLeft: 16,
  },
  qualityValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.success,
  },
  qualityLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  qualityBar: {
    height: 8,
    backgroundColor: colors.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  qualityBarFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 4,
  },
  costCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  costValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginLeft: 16,
  },
  supplierCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  supplierValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary[600],
    marginTop: 12,
  },
  supplierLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
});