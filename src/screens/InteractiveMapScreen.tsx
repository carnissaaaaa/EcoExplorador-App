import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  SafeAreaView, 
  Platform, 
  StatusBar, 
  Animated, 
  Easing 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { biomesData } from '../data/biomesData';

const customFont = Platform.OS === 'web'
  ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  : (Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium');

interface MapPin {
  id: string;
  name: string;
  top: any;
  left: any;
  percentage: string;
  shortDesc: string;
}

const mapPins: MapPin[] = [
  { 
    id: 'amazonia', 
    name: 'Amazônia', 
    top: '28%', 
    left: '32%',
    percentage: '49.3%',
    shortDesc: 'A maior floresta tropical do mundo, essencial para o clima e dona da maior reserva de água doce.'
  },
  { 
    id: 'caatinga', 
    name: 'Caatinga', 
    top: '32%', 
    left: '72%',
    percentage: '9.9%',
    shortDesc: 'Bioma exclusivo do Brasil com plantas xerófitas altamente adaptadas à semiaridez.'
  },
  { 
    id: 'cerrado', 
    name: 'Cerrado', 
    top: '50%', 
    left: '52%',
    percentage: '23.9%',
    shortDesc: 'A savana mais rica do planeta, conhecida como o "berço das águas" do território brasileiro.'
  },
  { 
    id: 'mata-atlantica', 
    name: 'Mata Atlântica', 
    top: '64%', 
    left: '68%',
    percentage: '13.0%',
    shortDesc: 'Floresta tropical de altíssima biodiversidade, severamente ameaçada pela urbanização histórica.'
  },
  { 
    id: 'pantanal', 
    name: 'Pantanal', 
    top: '60%', 
    left: '33%',
    percentage: '1.8%',
    shortDesc: 'A maior planície de inundação contínua do mundo e santuário preservado de fauna nativa.'
  },
  { 
    id: 'pampa', 
    name: 'Pampa', 
    top: '82%', 
    left: '42%',
    percentage: '2.1%',
    shortDesc: 'Campos sulinos dominados por gramíneas, fundamentais para regulação ecológica regional.'
  }
];

export function InteractiveMapScreen({ navigation }: any) {
  const [selectedBiomeId, setSelectedBiomeId] = useState<string>('amazonia');
  
  // Animações do Painel de Detalhes e Pins
  const slideAnim = useRef(new Animated.Value(100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Encontra os detalhes do bioma selecionado
  const activePin = mapPins.find(p => p.id === selectedBiomeId) || mapPins[0];
  const fullBiomeInfo = biomesData[selectedBiomeId];

  useEffect(() => {
    // Resetar e executar animação quando o bioma muda
    slideAnim.setValue(40);
    fadeAnim.setValue(0);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true
      })
    ]).start();
  }, [selectedBiomeId]);

  const handleSelectBiome = (id: string) => {
    setSelectedBiomeId(id);
  };

  const handleExploreMore = () => {
    navigation.navigate('BiomeDetails', { biomeId: selectedBiomeId });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBackButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mapa de Biomas</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Conteiner do Mapa */}
      <View style={styles.mapContainer}>
        {/* Nome explicativo */}
        <Text style={styles.mapHint}>Selecione um ponto no mapa para explorar</Text>

        {/* Moldura do Mapa do Brasil */}
        <View style={styles.mapWrapper}>
          <Image 
            source={require('../../assets/brazil_biomes_map.png')} 
            style={styles.mapBackground} 
            resizeMode="contain"
          />
          
          {/* Renderização dos Pins Interativos posicionados sobre o Mapa */}
          {mapPins.map((pin) => {
            const isSelected = pin.id === selectedBiomeId;
            return (
              <TouchableOpacity
                key={pin.id}
                style={[
                  styles.pinTouchable, 
                  { top: pin.top, left: pin.left }
                ]}
                onPress={() => handleSelectBiome(pin.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.pinOuter, isSelected && styles.pinOuterSelected]}>
                  <View style={[styles.pinInner, isSelected && styles.pinInnerSelected]}>
                    <Ionicons 
                      name={isSelected ? "leaf" : "pin"} 
                      size={isSelected ? 14 : 12} 
                      color="#FFFFFF" 
                    />
                  </View>
                </View>
                {/* Nome flutuante sob o pin */}
                <View style={[styles.pinLabelContainer, isSelected && styles.pinLabelActive]}>
                  <Text style={[styles.pinLabelText, isSelected && styles.pinLabelTextActive]}>
                    {pin.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Painel de Detalhes do Bioma Selecionado */}
      <Animated.View style={[
        styles.detailsPanel, 
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}>
        <View style={styles.panelHeader}>
          <View>
            <Text style={styles.panelTitle}>{activePin.name}</Text>
            <Text style={styles.panelSub}>Bioma do Brasil</Text>
          </View>
          <View style={styles.percentageBadge}>
            <Text style={styles.percentageText}>{activePin.percentage} do País</Text>
          </View>
        </View>

        <Text style={styles.panelDesc}>{activePin.shortDesc}</Text>

        {/* Estatísticas rápidas de conservação */}
        <View style={styles.panelStatsRow}>
          <View style={styles.panelStatItem}>
            <Text style={styles.panelStatVal}>{fullBiomeInfo?.deforestationRate}%</Text>
            <Text style={styles.panelStatLabel}>Área Desmatada</Text>
          </View>
          <View style={styles.panelStatItem}>
            <Text style={styles.panelStatVal}>{fullBiomeInfo?.fauna.length}</Text>
            <Text style={styles.panelStatLabel}>Espécies de Fauna</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.exploreButton} 
          onPress={handleExploreMore}
          activeOpacity={0.8}
        >
          <Text style={styles.exploreButtonText}>Explorar Conteúdo Completo</Text>
          <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
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
    zIndex: 20,
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
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  mapWrapper: {
    width: '92%',
    maxWidth: 360,
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  mapBackground: {
    width: '100%',
    height: '100%',
    opacity: 0.75, // Ajusta opacidade para casar com o tema escuro
  },
  mapHint: {
    position: 'absolute',
    top: 20,
    fontFamily: customFont,
    color: '#94A3B8',
    fontSize: 13,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
    textAlign: 'center',
    zIndex: 10,
  },
  pinTouchable: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 90,
    zIndex: 15,
  },
  pinOuter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(52, 211, 153, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinOuterSelected: {
    backgroundColor: 'rgba(16, 185, 129, 0.4)',
    transform: [{ scale: 1.25 }],
  },
  pinInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  pinInnerSelected: {
    backgroundColor: '#10B981',
  },
  pinLabelContainer: {
    marginTop: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  pinLabelActive: {
    backgroundColor: '#10B981',
    borderColor: '#34D399',
  },
  pinLabelText: {
    fontFamily: customFont,
    color: '#E2E8F0',
    fontSize: 10,
    fontWeight: 'bold',
  },
  pinLabelTextActive: {
    color: '#FFFFFF',
  },
  detailsPanel: {
    backgroundColor: '#111C15',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 20,
    zIndex: 30,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  panelTitle: {
    fontFamily: customFont,
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  panelSub: {
    fontFamily: customFont,
    fontSize: 12,
    color: '#10B981',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  percentageBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  percentageText: {
    fontFamily: customFont,
    color: '#34D399',
    fontSize: 12,
    fontWeight: 'bold',
  },
  panelDesc: {
    fontFamily: customFont,
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 20,
  },
  panelStatsRow: {
    flexDirection: 'row',
    marginBottom: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 16,
  },
  panelStatItem: {
    flex: 1,
  },
  panelStatVal: {
    fontFamily: customFont,
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  panelStatLabel: {
    fontFamily: customFont,
    fontSize: 11,
    color: '#94A3B8',
  },
  exploreButton: {
    backgroundColor: '#10B981',
    borderRadius: 30,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#34D399',
  },
  exploreButtonText: {
    fontFamily: customFont,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
