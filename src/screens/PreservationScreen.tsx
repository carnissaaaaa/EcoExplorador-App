import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView, 
  SafeAreaView, 
  Platform, 
  StatusBar, 
  Animated, 
  Easing 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const customFont = Platform.OS === 'web'
  ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  : (Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium');

interface ActionItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

const actionItems: ActionItem[] = [
  {
    id: 'residuos',
    icon: 'recycle-outline',
    title: 'Gestão de Resíduos',
    description: 'Aterros sanitários são grandes emissores de metano (CH4), um dos gases de efeito estufa. Faça compostagem para resíduos orgânicos em sua residência e separe materiais recicláveis.',
    color: '#34D399'
  },
  {
    id: 'plastico',
    icon: 'bag-handle-outline',
    title: 'Reduza o Plástico',
    description: 'Prefira sacolas reutilizáveis, evite produtos com embalagens excessivas e escolha itens com refil. Cada pequena escolha reduz o volume de plástico nos oceanos.',
    color: '#60A5FA'
  },
  {
    id: 'mobilidade',
    icon: 'bicycle-outline',
    title: 'Mobilidade Sustentável',
    description: 'Use transporte público, bicicleta ou carona solidária. Se possível, opte por veículos elétricos ou híbridos. Cada viagem compartilhada reduz emissões de CO2.',
    color: '#FBBF24'
  },
  {
    id: 'arvores',
    icon: 'leaf-outline',
    title: 'Plantio de Árvores',
    description: 'Plante árvores nativas em sua comunidade ou apoie projetos de reflorestamento. O Brasil tem a meta de plantar 12 milhões de hectares até 2030.',
    color: '#10B981'
  }
];

export function PreservationScreen({ navigation }: any) {
  const [selectedActionId, setSelectedActionId] = useState<string>('residuos');
  
  // Animação para troca de conteúdo
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const activeAction = actionItems.find(item => item.id === selectedActionId) || actionItems[0];

  const handleSelectAction = (id: string) => {
    // Transição animada
    Animated.parallel([
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0.3, duration: 150, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true })
      ]),
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 0.95, duration: 150, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 250, useNativeDriver: true })
      ])
    ]).start();

    setSelectedActionId(id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBackButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preservação</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentWrapper}>

          {/* Banner Ilustrativo */}
          <View style={styles.bannerContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop' }} 
              style={styles.bannerImage} 
            />
            <View style={styles.bannerOverlay} />
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Preservar é Dever de Todos</Text>
              <Text style={styles.bannerSub}>Pequenas ações diárias criam um impacto global positivo.</Text>
            </View>
          </View>

          {/* Seção: Ações Práticas (Interactive Balloons) */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Ações Práticas Interativas</Text>
            <Text style={styles.sectionSubtitle}>Selecione um ícone para ler sobre a ação:</Text>
            
            {/* Linha de Botões Interativos (Balloons) */}
            <View style={styles.balloonRow}>
              {actionItems.map((item) => {
                const isSelected = item.id === selectedActionId;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.balloonButton,
                      isSelected && { borderColor: item.color, backgroundColor: 'rgba(255,255,255,0.06)' }
                    ]}
                    onPress={() => handleSelectAction(item.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.balloonIconBox, { backgroundColor: `${item.color}15` }]}>
                      <Ionicons name={item.icon as any} size={28} color={item.color} />
                    </View>
                    <Text style={[styles.balloonText, isSelected && { color: '#FFFFFF', fontWeight: 'bold' }]}>
                      {item.title.split(' ')[0]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Caixa de Detalhes da Ação */}
            <Animated.View style={[
              styles.actionDetailBox, 
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }], borderLeftColor: activeAction.color }
            ]}>
              <Text style={[styles.detailTitle, { color: activeAction.color }]}>{activeAction.title}</Text>
              <Text style={styles.detailDesc}>{activeAction.description}</Text>
            </Animated.View>
          </View>

          {/* Seção: Consumo Consciente */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Consumo Consciente</Text>
            
            <View style={styles.consciousCard}>
              <View style={styles.consciousIconBox}>
                <Ionicons name="nutrition-outline" size={24} color="#34D399" />
              </View>
              <View style={styles.consciousContent}>
                <Text style={styles.consciousTitle}>Reduza o Desperdício</Text>
                <Text style={styles.consciousDesc}>
                  Planeje suas compras de alimentos, armazene corretamente os vegetais e aproveite sobras criativamente.
                </Text>
              </View>
            </View>

            <View style={styles.consciousCard}>
              <View style={styles.consciousIconBox}>
                <Ionicons name="barcode-outline" size={24} color="#60A5FA" />
              </View>
              <View style={styles.consciousContent}>
                <Text style={styles.consciousTitle}>Evite Produtos com Risco</Text>
                <Text style={styles.consciousDesc}>
                  Dê preferência a produtos com selos de sustentabilidade legítimos como o FSC (Forest Stewardship Council).
                </Text>
              </View>
            </View>

            <View style={styles.consciousCard}>
              <View style={styles.consciousIconBox}>
                <Ionicons name="flash-outline" size={24} color="#FBBF24" />
              </View>
              <View style={styles.consciousContent}>
                <Text style={styles.consciousTitle}>Poupe Recursos Naturais</Text>
                <Text style={styles.consciousDesc}>
                  Evite banhos excessivamente longos e desligue tomadas de eletrodomésticos que não estão em uso imediato.
                </Text>
              </View>
            </View>
          </View>

          {/* Seção: Apoie ONGs Ambientais */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Apoie Organizações Ambientais</Text>
            <Text style={styles.sectionSubtitle}>ONGs sérias que lutam pela conservação dos biomas:</Text>

            <View style={styles.ngoCard}>
              <Text style={styles.ngoName}>IPÊ (Instituto de Pesquisas Ecológicas)</Text>
              <Text style={styles.ngoDesc}>
                Focado em salvar espécies ameaçadas e restaurar biomas como a Mata Atlântica e o Pantanal com pesquisa prática.
              </Text>
            </View>

            <View style={styles.ngoCard}>
              <Text style={styles.ngoName}>WWF Brasil</Text>
              <Text style={styles.ngoDesc}>
                Atua na proteção da biodiversidade de ecossistemas florestais e promoção do uso sustentável de recursos naturais.
              </Text>
            </View>

            <View style={styles.ngoCard}>
              <Text style={styles.ngoName}>SOS Mata Atlântica</Text>
              <Text style={styles.ngoDesc}>
                Dedica-se a monitorar o desmatamento e promover reflorestamentos em toda a extensão da Mata Atlântica costeira.
              </Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B130E',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: customFont,
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 40,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 420,
  },
  bannerContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 19, 14, 0.65)',
  },
  bannerTextContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  bannerTitle: {
    fontFamily: customFont,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  bannerSub: {
    fontFamily: customFont,
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 18,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionTitle: {
    fontFamily: customFont,
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontFamily: customFont,
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 20,
  },
  balloonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  balloonButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  balloonIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  balloonText: {
    fontFamily: customFont,
    color: '#94A3B8',
    fontSize: 10,
    textAlign: 'center',
  },
  actionDetailBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderLeftWidth: 4,
    padding: 18,
    marginTop: 5,
  },
  detailTitle: {
    fontFamily: customFont,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  detailDesc: {
    fontFamily: customFont,
    color: '#E2E8F0',
    fontSize: 14,
    lineHeight: 22,
  },
  consciousCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 16,
    marginBottom: 15,
    alignItems: 'center',
  },
  consciousIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  consciousContent: {
    flex: 1,
  },
  consciousTitle: {
    fontFamily: customFont,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  consciousDesc: {
    fontFamily: customFont,
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
  },
  ngoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 18,
    marginBottom: 15,
  },
  ngoName: {
    fontFamily: customFont,
    color: '#10B981',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  ngoDesc: {
    fontFamily: customFont,
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
  },
});
