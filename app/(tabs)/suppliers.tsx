import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useERP } from '@/hooks/useERP';
import { useAlert } from '@/template';
import { colors } from '@/constants/colors';
import type { Supplier } from '@/types/erp';

export default function SuppliersScreen() {
  const { suppliers, loading, addSupplier, refreshData } = useERP();
  const { showAlert } = useAlert();
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    contact_name: '',
    phone: '',
    email: '',
    address: '',
    rating: 0,
    notes: '',
  });

  const handleSubmit = async () => {
    if (!formData.code || !formData.name) {
      showAlert('Erro', 'Preencha código e nome do fornecedor');
      return;
    }

    const { error } = await addSupplier({
      code: formData.code,
      name: formData.name,
      contact_name: formData.contact_name || undefined,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      address: formData.address || undefined,
      rating: formData.rating || undefined,
      notes: formData.notes || undefined,
      is_active: true,
    } as any);

    if (error) {
      showAlert('Erro', 'Falha ao adicionar fornecedor');
      return;
    }

    showAlert('Sucesso', 'Fornecedor adicionado');
    setModalVisible(false);
    setFormData({
      code: '',
      name: '',
      contact_name: '',
      phone: '',
      email: '',
      address: '',
      rating: 0,
      notes: '',
    });
  };

  const renderStars = (rating?: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MaterialIcons
          key={i}
          name={i <= (rating || 0) ? 'star' : 'star-border'}
          size={20}
          color={colors.warning}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshData} />
        }
      >
        {suppliers.map((supplier) => (
          <View key={supplier.id} style={styles.supplierCard}>
            <View style={styles.supplierHeader}>
              <View>
                <Text style={styles.supplierCode}>{supplier.code}</Text>
                <Text style={styles.supplierName}>{supplier.name}</Text>
              </View>
              {supplier.rating && (
                <View style={styles.ratingContainer}>
                  {renderStars(supplier.rating)}
                </View>
              )}
            </View>

            {supplier.contact_name && (
              <View style={styles.infoRow}>
                <MaterialIcons name="person" size={18} color={colors.text.secondary} />
                <Text style={styles.infoText}>{supplier.contact_name}</Text>
              </View>
            )}

            {supplier.phone && (
              <View style={styles.infoRow}>
                <MaterialIcons name="phone" size={18} color={colors.text.secondary} />
                <Text style={styles.infoText}>{supplier.phone}</Text>
              </View>
            )}

            {supplier.email && (
              <View style={styles.infoRow}>
                <MaterialIcons name="email" size={18} color={colors.text.secondary} />
                <Text style={styles.infoText}>{supplier.email}</Text>
              </View>
            )}

            {supplier.address && (
              <View style={styles.infoRow}>
                <MaterialIcons name="location-on" size={18} color={colors.text.secondary} />
                <Text style={styles.infoText}>{supplier.address}</Text>
              </View>
            )}

            {supplier.notes && (
              <View style={styles.notesContainer}>
                <Text style={styles.notesText}>{supplier.notes}</Text>
              </View>
            )}
          </View>
        ))}

        {suppliers.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <MaterialIcons name="local-shipping" size={64} color={colors.neutral[400]} />
            <Text style={styles.emptyText}>Nenhum fornecedor cadastrado</Text>
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
              <Text style={styles.modalTitle}>Novo Fornecedor</Text>
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

              <TextInput
                style={styles.input}
                placeholder="Contato"
                value={formData.contact_name}
                onChangeText={(text) => setFormData({ ...formData, contact_name: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Telefone"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                keyboardType="phone-pad"
              />

              <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Endereço"
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
              />

              <View style={styles.ratingSection}>
                <Text style={styles.label}>Avaliação</Text>
                <View style={styles.ratingInput}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setFormData({ ...formData, rating: star })}
                    >
                      <MaterialIcons
                        name={star <= formData.rating ? 'star' : 'star-border'}
                        size={32}
                        color={colors.warning}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Observações"
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Adicionar Fornecedor</Text>
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
  supplierCard: {
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
  supplierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  supplierCode: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  supplierName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
  },
  notesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  notesText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontStyle: 'italic',
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
  ratingSection: {
    marginBottom: 16,
  },
  ratingInput: {
    flexDirection: 'row',
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