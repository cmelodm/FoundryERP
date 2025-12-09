# 🏭 FundiçãoPro ERP

**Sistema ERP Completo para Gestão de Fundição Industrial**

[![Flutter Version](https://img.shields.io/badge/Flutter-3.35.4-blue.svg)](https://flutter.dev/)
[![Dart Version](https://img.shields.io/badge/Dart-3.9.2-blue.svg)](https://dart.dev/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

---

## 📖 Sobre o Projeto

O **FundiçãoPro ERP** é um sistema completo de gestão empresarial especializado em fundições metalúrgicas, desenvolvido em Flutter para garantir alta performance e multiplataforma. O sistema oferece controle total sobre produção, materiais, qualidade, compras, vendas e análises metalúrgicas.

### ✨ Principais Funcionalidades

- 🔐 **Sistema de Autenticação** com 4 níveis de acesso hierárquico
- 📊 **Dashboard Analítico** com estatísticas em tempo real
- 📦 **Gestão de Materiais** com controle de estoque e alertas
- 🏭 **Ordens de Produção** com Kanban visual
- 🛒 **Ordens de Compra** integradas com fornecedores
- 💰 **Ordens de Venda** com emissão de NF e baixa automática de estoque
- 👥 **Gestão de Fornecedores** com sistema de avaliação
- 🔬 **19 Ligas Metalúrgicas** padrão (SAE/ASTM/DIN/AA)
- 🧪 **Análise Espectrométrica** com cálculo de correções
- ✅ **Controle de Qualidade** completo
- 📄 **Parser XML** de Notas Fiscais Eletrônicas (NF-e)
- 📈 **Relatórios** em PDF e CSV

---

## 🎯 Público-Alvo

- **Fundições Metalúrgicas**
- **Indústrias de Usinagem**
- **Empresas de Conformação de Metais**
- **Fabricantes de Peças Automotivas**
- **Indústrias de Metalurgia em Geral**

---

## 🚀 Início Rápido

### Pré-requisitos

- Flutter 3.35.4 ou superior
- Dart 3.9.2 ou superior
- Android SDK (API Level 24+)
- Java 17 (OpenJDK 17.0.2)

### Instalação

```bash
# 1. Clone o repositório (ou extraia o backup)
# Se você tem o arquivo .tar.gz ou .zip:
tar -xzf fundicaopro-erp-completo.tar.gz
# ou
unzip fundicaopro-erp-completo.zip

# 2. Entre no diretório do projeto
cd flutter_app

# 3. Instale as dependências
flutter pub get

# 4. Execute o projeto
flutter run
```

### Preview Web

```bash
# Build para web
flutter build web --release

# Servir com Python
python3 -m http.server 5060 --directory build/web --bind 0.0.0.0

# Acesse: http://localhost:5060
```

### Compilar APK Android

```bash
# APK Release
flutter build apk --release

# APK localizado em:
# build/app/outputs/flutter-apk/app-release.apk
```

---

## 👤 Usuários de Teste

| Nível | E-mail | Senha | Permissões |
|-------|--------|-------|------------|
| **Administrador** | admin@fundicaopro.com.br | admin123 | Acesso total + gestão de usuários |
| **Gerente** | gerente@fundicaopro.com.br | gerente123 | Gestão operacional e relatórios |
| **Operador** | operador@fundicaopro.com.br | operador123 | Operações do dia a dia |
| **Visualizador** | visualizador@fundicaopro.com.br | visualizador123 | Apenas consulta |

---

## 📦 Módulos do Sistema

### 1. 🔐 Autenticação e Usuários
- Login com e-mail/senha
- 4 Níveis de acesso (Admin, Gerente, Operador, Visualizador)
- CRUD completo de usuários
- Alteração de senha
- Controle de permissões por tela

### 2. 📊 Dashboard
- Estatísticas em tempo real
- Gráficos interativos
- Alertas de estoque
- Indicadores de produção
- Resumo de ordens (compra/venda/produção)

### 3. 📦 Materiais e Estoque
- CRUD completo de materiais
- Controle de estoque (entrada/saída)
- Alertas de estoque mínimo
- Histórico de movimentações
- Rastreabilidade NCM, ICMS, IPI

### 4. 🏭 Ordens de Produção
- Kanban visual por status
- Formulário completo "Nova Ordem"
- Seleção de materiais com validação de estoque
- Cálculo automático de custo estimado
- Controle de etapas de produção
- Baixa automática de estoque ao concluir

### 5. 🛒 Ordens de Compra
- Gestão completa de compras
- Integração com fornecedores
- Recebimento de materiais
- Atualização automática de estoque

### 6. 💰 Ordens de Venda
- Gestão completa de vendas
- Faturamento com validação de estoque
- Emissão de nota fiscal
- Baixa automática de estoque
- Rastreamento de entrega

### 7. 👥 Fornecedores
- CRUD completo
- Avaliação de desempenho (4 critérios)
- Histórico de avaliações
- Integração com ordens de compra

### 8. 🔬 Ligas Metalúrgicas
- **19 Ligas Padrão Cadastradas:**
  - 6 Ligas SAE (303, 305, 306, 309, 323, 329)
  - 2 Ligas ASTM (A356, A357)
  - 4 Ligas DIN/EN 1706
  - 7 Ligas AA (201.0, 319.0, 380.0, 383.0, 413.0, 443.0, 514.0)
- Criação de ligas personalizadas
- Composição química detalhada

### 9. 🧪 Análise Espectrométrica
- Registro de análises químicas
- Comparação com especificação da liga
- Detecção automática de não-conformidades
- Parser XML de equipamentos
- **Cálculo de correção de liga**

### 10. ✅ Controle de Qualidade
- Registro de inspeções
- Tipos de teste configuráveis
- Resultados: Aprovado/Reprovado/Retrabalho
- Registro de não-conformidades
- Gestão de equipamentos e inspetores

### 11. 📄 Notas Fiscais
- Parser XML de NF-e completo
- Importação automática de dados
- Visualização detalhada
- Extração de itens da nota

### 12. 📈 Relatórios
- **Tipos de Relatório:**
  - Materiais
  - Produção
  - Fornecedores
  - Qualidade
  - Análises Espectrométricas
  - Notas Fiscais
- **Formatos:** PDF e CSV

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Flutter** | 3.35.4 | Framework multiplataforma |
| **Dart** | 3.9.2 | Linguagem de programação |
| **Firebase Core** | 3.6.0 | Backend as a Service |
| **Firebase Auth** | 5.3.1 | Autenticação |
| **Firestore** | 5.4.3 | Banco de dados NoSQL |
| **Firebase Storage** | 12.3.2 | Armazenamento de arquivos |
| **Provider** | 6.1.5+1 | Gerenciamento de estado |
| **PDF** | 3.11.1 | Geração de relatórios |
| **FL Chart** | 0.69.0 | Gráficos |
| **File Picker** | 8.1.4 | Seleção de arquivos |
| **HTTP** | 1.5.0 | Requisições REST |
| **Intl** | 0.19.0 | Internacionalização |
| **XML** | 6.5.0 | Parser de NF-e |

---

## 📁 Estrutura do Projeto

```
flutter_app/
├── lib/
│   ├── main.dart                   # Ponto de entrada
│   ├── models/                     # 13 Modelos de dados
│   ├── screens/                    # 15 Telas principais
│   ├── services/                   # 5 Serviços
│   ├── widgets/                    # Componentes reutilizáveis
│   ├── providers/                  # Provedores de estado
│   └── utils/                      # Utilitários
├── android/                        # Configuração Android
├── web/                            # Configuração Web
├── test/                           # Testes automatizados
├── pubspec.yaml                    # Dependências
└── README.md                       # Este arquivo
```

---

## 🔄 Fluxos Principais

### Fluxo Completo: Compra → Estoque → Produção → Venda

```
1. COMPRA
   ├── Criar Ordem de Compra
   ├── Selecionar Fornecedor
   ├── Aguardar Entrega
   └── ✅ Receber Materiais (Estoque +)

2. PRODUÇÃO
   ├── Criar Ordem de Produção
   ├── Selecionar Materiais
   ├── Executar Etapas
   ├── Inspeção de Qualidade
   └── ✅ Produto Concluído

3. VENDA
   ├── Criar Ordem de Venda
   ├── Verificar Estoque
   ├── Faturar Ordem
   ├── Emitir NF de Saída
   └── ✅ Estoque Atualizado (-)
```

---

## 🧪 Testes

```bash
# Executar todos os testes
flutter test

# Executar testes específicos
flutter test test/models/material_model_test.dart

# Testes com cobertura
flutter test --coverage
```

---

## 📊 Estatísticas

| Métrica | Valor |
|---------|-------|
| **Arquivos Dart** | 50+ |
| **Linhas de Código** | ~15.000 |
| **Modelos de Dados** | 13 |
| **Telas Principais** | 15 |
| **Serviços** | 5 |
| **Ligas Padrão** | 19 |
| **Funcionalidades** | 30+ |

---

## 📱 Plataformas Suportadas

| Plataforma | Status |
|------------|--------|
| ✅ **Android** | Completo (APK 54.5MB) |
| ✅ **Web** | Completo (Preview disponível) |
| ⚠️ **iOS** | Requer configuração |
| ⚠️ **Windows** | Em desenvolvimento |
| ⚠️ **Linux** | Em desenvolvimento |
| ⚠️ **macOS** | Requer configuração |

---

## 🔮 Roadmap Futuro

### Fase 4: Integrações Avançadas
- [ ] API REST para integrações
- [ ] Integração com ERP externo
- [ ] Sincronização com sistema financeiro
- [ ] Marketplace B2B

### Fase 5: Analytics e BI
- [ ] Dashboard de BI avançado
- [ ] Predição de demanda (ML)
- [ ] Análise preditiva de qualidade
- [ ] Otimização de estoque (IA)

### Fase 6: Mobilidade
- [ ] App mobile nativo (iOS/Android)
- [ ] Modo offline com sincronização
- [ ] Leitura de QR Code / Barcode
- [ ] Assinatura digital

---

## 🤝 Contribuindo

Este é um projeto proprietário. Para contribuições, entre em contato com a equipe de desenvolvimento.

---

## 📄 Licença

Este projeto é proprietário e confidencial.

**© 2024 FundiçãoPro ERP. Todos os direitos reservados.**

---

## 📞 Suporte

Para suporte técnico ou dúvidas:

- 📧 E-mail: suporte@fundicaopro.com.br
- 📱 Telefone: (XX) XXXX-XXXX
- 🌐 Website: www.fundicaopro.com.br

---

## 🎉 Agradecimentos

Desenvolvido com 💙 usando Flutter e Dart.

**Versão:** 1.0.0  
**Data de Lançamento:** Dezembro 2024

---

## 📚 Documentação Adicional

Para documentação técnica completa, consulte:

- **DOCUMENTACAO_TECNICA.md** - Documentação detalhada (200+ páginas)
- **Arquitetura do Sistema**
- **Guia de Desenvolvimento**
- **API Reference**
- **Troubleshooting Guide**

---

**🚀 Pronto para transformar a gestão da sua fundição!**
