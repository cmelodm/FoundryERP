import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useERP } from '@/hooks/useERP';
import { useAlert } from '@/template';
import { colors } from '@/constants/colors';
import type { ProductionOrder } from '@/types/erp';

export default function ProductionScreen() {
  const { productionOrders, materials, loading, addProductionOrder, updateProductionOrder, refreshData } = useERP();
  const { showAlert } = useAlert();
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    order_number: '',
    product_id: '',
    quantity: '',
    priority: 'normal' as ProductionOrder['priority'],
    expected_end_date: '',
  });

  const handleSubmit = async () => {
    if (!formData.order_number || !formData.product_id || !formData.quantity) {
      showAlert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const product = materials.find(m => m.id === formData.product_id);
    if (!product) return;

    const { error } = await addProductionOrder({
      order_number: formData.order_number,
      product_id: formData.product_id,
      quantity: parseFloat(formData.quantity),
      unit: product.unit,
      status: 'pending',
      priority: formData.priority,
      expected_end_date: formData.expected_end_date || undefined,
    } as any);

    if (error) {
      showAlert('Erro', 'Falha ao criar ordem de produção');
      return;
    }

    showAlert('Sucesso', 'Ordem de produção criada');
    setModalVisible(false);
    setFormData({
      order_number: '',
      product_id: '',
      quantity: '',
      priority: 'normal',
      expected_end_date: '',
    });
  };

  const handleStatusChange = async (id: string, status: ProductionOrder['status']) => {
    const { error } = await updateProductionOrder(id, { status });
    if (error) {
      showAlert('Erro', 'Falha ao atualizar status');
    }
  };

  const getStatusColor = (status: ProductionOrder['status']) => {
    switch (status) {
      case 'pending': return colors.warning;
      case 'in_progress': return colors.primary[600];
      case 'completed': return colors.success;
      case 'cancelled': return colors.error;
      default: return colors.neutral[500];
    }
  };

  const getStatusLabel = (status: ProductionOrder['status']) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em Produção';
      case 'completed': return 'Concluída';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const getPriorityColor = (priority: ProductionOrder['priority']) => {
    switch (priority) {
      case 'urgent': return colors.error;
      case 'high': return colors.warning;
      case 'normal': return colors.primary[600];
      case 'low': return colors.neutral[500];
      default: return colors.neutral[500];
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshData} />
        }
      >
        {productionOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderNumber}>{order.order_number}</Text>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(order.priority) + '20' }]}>
                <Text style={[styles.priorityText, { color: getPriorityColor(order.priority) }]}>
                  {order.priority.toUpperCase()}
                </Text>
              </View>
            </View>

            <Text style={styles.productName}>{order.product?.name}</Text>
            <Text style={styles.quantity}>
              Quantidade: {order.quantity} {order.product?.unit}
            </Text>

            <View style={styles.statusContainer}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                <Text style={styles.statusText}>{getStatusLabel(order.status)}</Text>
              </View>
            </View>

            {order.status !== 'completed' && order.status !== 'cancelled' && (
              <View style={styles.actionButtons}>
                {order.status === 'pending' && (
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.primary[600] }]}
                    onPress={() => handleStatusChange(order.id, 'in_progress')}
                  >
                    <MaterialIcons name="play-arrow" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Iniciar</Text>
                  </TouchableOpacity>
                )}
                {order.status === 'in_progress' && (
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.success }]}
                    onPress={() => handleStatusChange(order.id, 'completed')}
                  >
                    <MaterialIcons name="check" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Concluir</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.error }]}
                  onPress={() => handleStatusChange(order.id, 'cancelled')}
                >
                  <MaterialIcons name="close" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {productionOrders.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <MaterialIcons name="precision-manufacturing" size={64} color={colors.neutral[400]} />
            <Text style={styles.emptyText}>Nenhuma ordem de produção</Text>
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
              <Text style={styles.modalTitle}>Nova Ordem de Produção</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <TextInput
                style={styles.input}
                placeholder="Número da Ordem *"
                value={formData.order_number}
                onChangeText={(text) => setFormData({ ...formData, order_number: text })}
              />

              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Produto *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {materials.filter(m => m.type === 'finished_product').map(material => (
                    <TouchableOpacity
                      key={material.id}
                      style={[
                        styles.chip,
                        formData.product_id === material.id && styles.chipSelected
                      ]}
                      onPress={() => setFormData({ ...formData, product_id: material.id })}
                    >
                      <Text style={[
                        styles.chipText,
                        formData.product_id === material.id && styles.chipTextSelected
                      ]}>
                        {material.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Quantidade *"
                value={formData.quantity}
                onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                keyboardType="numeric"
              />

              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Prioridade</Text>
                <View style={styles.priorityOptions}>
                  {(['low', 'normal', 'high', 'urgent'] as const).map(priority => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.chip,
                        formData.priority === priority && styles.chipSelected
                      ]}
                      onPress={() => setFormData({ ...formData, priority })}
                    >
                      <Text style={[
                        styles.chipText,
                        formData.priority === priority && styles.chipTextSelected
                      ]}>
                        {priority === 'low' ? 'Baixa' : priority === 'normal' ? 'Normal' : 
                         priority === 'high' ? 'Alta' : 'Urgente'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Criar Ordem</Text>
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
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  productName: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 4,
  },
  quantity: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  statusContainer: {
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 4,
  },
  actionButtonText: {
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
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  chip: {
    backgroundColor: colors.neutral[100],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
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
  priorityOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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