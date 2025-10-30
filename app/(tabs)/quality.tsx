import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useERP } from '@/hooks/useERP';
import { useAlert } from '@/template';
import { colors } from '@/constants/colors';
import type { QualityInspection } from '@/types/erp';

export default function QualityScreen() {
  const { qualityInspections, loading, addQualityInspection, refreshData } = useERP();
  const { showAlert } = useAlert();
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    inspection_type: 'final' as QualityInspection['inspection_type'],
    status: 'approved' as QualityInspection['status'],
    inspector_name: '',
    notes: '',
    defects_found: '',
    corrective_actions: '',
  });

  const handleSubmit = async () => {
    if (!formData.inspector_name) {
      showAlert('Erro', 'Informe o nome do inspetor');
      return;
    }

    const { error } = await addQualityInspection({
      inspection_type: formData.inspection_type,
      status: formData.status,
      inspector_name: formData.inspector_name,
      inspection_date: new Date().toISOString(),
      notes: formData.notes || undefined,
      defects_found: formData.defects_found || undefined,
      corrective_actions: formData.corrective_actions || undefined,
    } as any);

    if (error) {
      showAlert('Erro', 'Falha ao registrar inspeção');
      return;
    }

    showAlert('Sucesso', 'Inspeção registrada');
    setModalVisible(false);
    setFormData({
      inspection_type: 'final',
      status: 'approved',
      inspector_name: '',
      notes: '',
      defects_found: '',
      corrective_actions: '',
    });
  };

  const getInspectionTypeLabel = (type: QualityInspection['inspection_type']) => {
    switch (type) {
      case 'incoming': return 'Recebimento';
      case 'in_process': return 'Em Processo';
      case 'final': return 'Final';
      case 'audit': return 'Auditoria';
      default: return type;
    }
  };

  const getStatusColor = (status: QualityInspection['status']) => {
    switch (status) {
      case 'approved': return colors.success;
      case 'rejected': return colors.error;
      case 'conditional': return colors.warning;
      default: return colors.neutral[500];
    }
  };

  const getStatusLabel = (status: QualityInspection['status']) => {
    switch (status) {
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      case 'conditional': return 'Condicional';
      default: return status;
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
        {qualityInspections.map((inspection) => (
          <View key={inspection.id} style={styles.inspectionCard}>
            <View style={styles.inspectionHeader}>
              <View style={[styles.typeBadge, { backgroundColor: colors.primary[100] }]}>
                <Text style={[styles.typeText, { color: colors.primary[700] }]}>
                  {getInspectionTypeLabel(inspection.inspection_type)}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(inspection.status) }]}>
                <MaterialIcons 
                  name={inspection.status === 'approved' ? 'check-circle' : 
                        inspection.status === 'rejected' ? 'cancel' : 'warning'} 
                  size={16} 
                  color="#fff" 
                />
                <Text style={styles.statusText}>{getStatusLabel(inspection.status)}</Text>
              </View>
            </View>

            <View style={styles.inspectionInfo}>
              <View style={styles.infoRow}>
                <MaterialIcons name="person" size={20} color={colors.text.secondary} />
                <Text style={styles.infoText}>{inspection.inspector_name}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="calendar-today" size={20} color={colors.text.secondary} />
                <Text style={styles.infoText}>
                  {new Date(inspection.inspection_date).toLocaleDateString('pt-BR')}
                </Text>
              </View>
            </View>

            {inspection.notes && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Observações</Text>
                <Text style={styles.sectionText}>{inspection.notes}</Text>
              </View>
            )}

            {inspection.defects_found && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Defeitos Encontrados</Text>
                <Text style={styles.sectionText}>{inspection.defects_found}</Text>
              </View>
            )}

            {inspection.corrective_actions && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ações Corretivas</Text>
                <Text style={styles.sectionText}>{inspection.corrective_actions}</Text>
              </View>
            )}
          </View>
        ))}

        {qualityInspections.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <MaterialIcons name="verified" size={64} color={colors.neutral[400]} />
            <Text style={styles.emptyText}>Nenhuma inspeção registrada</Text>
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
              <Text style={styles.modalTitle}>Nova Inspeção</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Tipo de Inspeção</Text>
                <View style={styles.typeOptions}>
                  {(['incoming', 'in_process', 'final', 'audit'] as const).map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.chip,
                        formData.inspection_type === type && styles.chipSelected
                      ]}
                      onPress={() => setFormData({ ...formData, inspection_type: type })}
                    >
                      <Text style={[
                        styles.chipText,
                        formData.inspection_type === type && styles.chipTextSelected
                      ]}>
                        {getInspectionTypeLabel(type)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Status</Text>
                <View style={styles.typeOptions}>
                  {(['approved', 'rejected', 'conditional'] as const).map(status => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.chip,
                        formData.status === status && styles.chipSelected
                      ]}
                      onPress={() => setFormData({ ...formData, status })}
                    >
                      <Text style={[
                        styles.chipText,
                        formData.status === status && styles.chipTextSelected
                      ]}>
                        {getStatusLabel(status)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Nome do Inspetor *"
                value={formData.inspector_name}
                onChangeText={(text) => setFormData({ ...formData, inspector_name: text })}
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Observações"
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                multiline
                numberOfLines={3}
              />

              {formData.status !== 'approved' && (
                <>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Defeitos Encontrados"
                    value={formData.defects_found}
                    onChangeText={(text) => setFormData({ ...formData, defects_found: text })}
                    multiline
                    numberOfLines={3}
                  />

                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Ações Corretivas"
                    value={formData.corrective_actions}
                    onChangeText={(text) => setFormData({ ...formData, corrective_actions: text })}
                    multiline
                    numberOfLines={3}
                  />
                </>
              )}

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Registrar Inspeção</Text>
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
  inspectionCard: {
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
  inspectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
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
  inspectionInfo: {
    marginBottom: 12,
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
  },
  section: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  sectionText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
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