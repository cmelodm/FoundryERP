import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useERP } from '@/hooks/useERP';
import { useAlert } from '@/template';
import { colors } from '@/constants/colors';
import type { Material } from '@/types/erp';

export default function MaterialsScreen() {
  const { materials, loading, addMaterial, refreshData } = useERP();
  const { showAlert } = useAlert();
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'raw_material' as Material['type'],
    unit: '',
    unit_cost: '',
    stock_quantity: '',
    min_stock: '',
    description: '',
  });

  const handleSubmit = async () => {
    if (!formData.code || !formData.name || !formData.unit) {
      showAlert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const { error } = await addMaterial({
      code: formData.code,
      name: formData.name,
      type: formData.type,
      unit: formData.unit,
      unit_cost: parseFloat(formData.unit_cost) || 0,
      stock_quantity: parseFloat(formData.stock_quantity) || 0,
      min_stock: parseFloat(formData.min_stock) || 0,
      description: formData.description || undefined,
      is_active: true,
    } as any);

    if (error) {
      showAlert('Erro', 'Falha ao adicionar material');
      return;
    }

    showAlert('Sucesso', 'Material adicionado');
    setModalVisible(false);
    setFormData({
      code: '',
      name: '',
      type: 'raw_material',
      unit: '',
      unit_cost: '',
      stock_quantity: '',
      min_stock: '',
      description: '',
    });
  };

  const getTypeLabel = (type: Material['type']) => {
    switch (type) {
      case 'raw_material': return 'Matéria-Prima';
      case 'finished_product': return 'Produto Acabado';
      case 'consumable': return 'Consumível';
      default: return type;
    }
  };

  const getStockStatus = (material: Material) => {
    if (material.stock_quantity <= material.min_stock) {
      return { color: colors.error, label: 'Estoque Baixo' };
    }
    return { color: colors.success, label: 'Estoque OK' };
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshData} />
        }
      >
        {materials.map((material) => {
          const stockStatus = getStockStatus(material);
          return (
            <View key={material.id} style={styles.materialCard}>
              <View style={styles.materialHeader}>
                <View>
                  <Text style={styles.materialCode}>{material.code}</Text>
                  <Text style={styles.materialName}>{material.name}</Text>
                </View>
                <View style={[styles.typeBadge, { backgroundColor: colors.primary[100] }]}>
                  <Text style={[styles.typeText, { color: colors.primary[700] }]}>
                    {getTypeLabel(material.type)}
                  </Text>
                </View>
              </View>

              <View style={styles.stockInfo}>
                <View style={styles.stockItem}>
                  <Text style={styles.stockLabel}>Estoque</Text>
                  <Text style={styles.stockValue}>
                    {material.stock_quantity} {material.unit}
                  </Text>
                </View>
                <View style={styles.stockItem}>
                  <Text style={styles.stockLabel}>Estoque Mínimo</Text>
                  <Text style={styles.stockValue}>
                    {material.min_stock} {material.unit}
                  </Text>
                </View>
                <View style={styles.stockItem}>
                  <Text style={styles.stockLabel}>Custo Unitário</Text>
                  <Text style={styles.stockValue}>
                    R$ {material.unit_cost.toFixed(2)}
                  </Text>
                </View>
              </View>

              <View style={[styles.statusBadge, { backgroundColor: stockStatus.color }]}>
                <MaterialIcons 
                  name={material.stock_quantity <= material.min_stock ? 'warning' : 'check-circle'} 
                  size={16} 
                  color="#fff" 
                />
                <Text style={styles.statusText}>{stockStatus.label}</Text>
              </View>
            </View>
          );
        })}

        {materials.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <MaterialIcons name="inventory-2" size={64} color={colors.neutral[400]} />
            <Text style={styles.emptyText}>Nenhum material cadastrado</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo Material</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <TextInput
                style={styles.input}
                placeholder="Código *"
                value={formData.code}
                onChangeText={(text) => setFormData({ ...formData, code: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Nome *"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />

              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Tipo de Material</Text>
                <View style={styles.typeOptions}>
                  {(['raw_material', 'finished_product', 'consumable'] as const).map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.chip,
                        formData.type === type && styles.chipSelected
                      ]}
                      onPress={() => setFormData({ ...formData, type })}
                    >
                      <Text style={[
                        styles.chipText,
                        formData.type === type && styles.chipTextSelected
                      ]}>
                        {getTypeLabel(type)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Unidade (kg, ton, pcs) *"
                value={formData.unit}
                onChangeText={(text) => setFormData({ ...formData, unit: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Custo Unitário"
                value={formData.unit_cost}
                onChangeText={(text) => setFormData({ ...formData, unit_cost: text })}
                keyboardType="decimal-pad"
              />

              <TextInput
                style={styles.input}
                placeholder="Quantidade em Estoque"
                value={formData.stock_quantity}
                onChangeText={(text) => setFormData({ ...formData, stock_quantity: text })}
                keyboardType="decimal-pad"
              />

              <TextInput
                style={styles.input}
                placeholder="Estoque Mínimo"
                value={formData.min_stock}
                onChangeText={(text) => setFormData({ ...formData, min_stock: text })}
                keyboardType="decimal-pad"
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descrição"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Adicionar Material</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  content: {
    flex: 1,
    padding: 16,
  },
  materialCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  materialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  materialCode: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  materialName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  stockInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stockItem: {
    flex: 1,
  },
  stockLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  stockValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  input: {
    backgroundColor: colors.neutral[50],
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    color: colors.text.primary,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  typeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.neutral[100],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral[300],
  },
  chipSelected: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  chipText: {
    color: colors.text.primary,
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: colors.primary[600],
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});