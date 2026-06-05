import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView, 
  SafeAreaView, 
  Platform, 
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { biomesData } from '../data/biomesData';

const customFont = Platform.OS === 'web'
  ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  : (Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium');

export function BiomeDetailsScreen({ route, navigation }: any) {
  const { biomeId } = route.params;
  const biome = biomesData[biomeId];
  const [activeTab, setActiveTab] = useState<'sobre' | 'fauna' | 'flora'>('sobre');

  if (!biome) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro: Bioma não encontrado.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBackButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{biome.title}</Text>
        <View style={{ width: 40 }} /> {/* Espaçador para centralizar título */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentWrapper}>
          
          {/* Imagem de Capa do Bioma */}
          <Image source={{ uri: biome.image }} style={styles.coverImage} />

          {/* Seção de Informações Rápidas */}
          <View style={styles.quickInfoSection}>
            <View style={styles.infoCard}>
              <Ionicons name="thermometer-outline" size={20} color="#34D399" />
              <Text style={styles.infoCardTitle}>Clima</Text>
              <Text style={styles.infoCardText} numberOfLines={2}>{biome.clima}</Text>
            </View>

            <View style={styles.infoCard}>
              <Ionicons name="analytics-outline" size={20} color="#F87171" />
              <Text style={styles.infoCardTitle}>Desmatamento</Text>
              <Text style={[styles.infoCardText, { color: '#F87171', fontWeight: 'bold' }]}>
                {biome.deforestationRate}% da área original
              </Text>
            </View>
          </View>

          {/* Abas de Navegação */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'sobre' && styles.tabButtonActive]}
              onPress={() => setActiveTab('sobre')}
            >
              <Text style={[styles.tabButtonText, activeTab === 'sobre' && styles.tabButtonTextActive]}>
                Sobre
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'fauna' && styles.tabButtonActive]}
              onPress={() => setActiveTab('fauna')}
            >
              <Text style={[styles.tabButtonText, activeTab === 'fauna' && styles.tabButtonTextActive]}>
                Fauna
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'flora' && styles.tabButtonActive]}
              onPress={() => setActiveTab('flora')}
            >
              <Text style={[styles.tabButtonText, activeTab === 'flora' && styles.tabButtonTextActive]}>
                Flora
              </Text>
            </TouchableOpacity>
          </View>

          {/* Conteúdo Dinâmico com base na aba ativa */}
          <View style={styles.tabContentContainer}>
            {activeTab === 'sobre' && (
              <View>
                <Text style={styles.tabContentDescription}>{biome.text}</Text>
                
                {/* Solo do Bioma */}
                <View style={styles.additionalInfoCard}>
                  <Text style={styles.additionalInfoTitle}>Solo</Text>
                  <Text style={styles.additionalInfoText}>{biome.solo}</Text>
                </View>

                {/* Curiosidades */}
                <Text style={styles.subsectionTitle}>Curiosidades</Text>
                {biome.curiosidades.map((item, index) => (
                  <View key={index} style={styles.curiosityItem}>
                    <View style={styles.curiosityDot} />
                    <Text style={styles.curiosityText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {activeTab === 'fauna' && (
              <View>
                <Text style={styles.tabContentIntro}>
                  Espécies animais emblemáticas da {biome.title}:
                </Text>
                <View style={styles.gridContainer}>
                  {biome.fauna.map((animal, index) => (
                    <View key={index} style={styles.gridCard}>
                      <View style={styles.gridCardIconBox}>
                        <Ionicons name="paw-outline" size={24} color="#34D399" />
                      </View>
                      <Text style={styles.gridCardText}>{animal}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {activeTab === 'flora' && (
              <View>
                <Text style={styles.tabContentIntro}>
                  Plantas e vegetações típicas da {biome.title}:
                </Text>
                <View style={styles.gridContainer}>
                  {biome.flora.map((plant, index) => (
                    <View key={index} style={styles.gridCard}>
                      <View style={styles.gridCardIconBox}>
                        <Ionicons name="leaf-outline" size={24} color="#34D399" />
                      </View>
                      <Text style={styles.gridCardText}>{plant}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
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
  errorContainer: {
    flex: 1,
    backgroundColor: '#0B130E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontFamily: customFont,
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontFamily: customFont,
    fontWeight: 'bold',
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
  coverImage: {
    width: '100%',
    height: 220,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  quickInfoSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    justifyContent: 'space-between',
  },
  infoCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 14,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  infoCardTitle: {
    fontFamily: customFont,
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 6,
    marginBottom: 4,
  },
  infoCardText: {
    fontFamily: customFont,
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: 20,
    marginTop: 25,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: '#10B981',
  },
  tabButtonText: {
    fontFamily: customFont,
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tabContentContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  tabContentDescription: {
    fontFamily: customFont,
    fontSize: 15,
    color: '#E2E8F0',
    lineHeight: 24,
    marginBottom: 20,
  },
  tabContentIntro: {
    fontFamily: customFont,
    fontSize: 15,
    color: '#94A3B8',
    marginBottom: 15,
  },
  additionalInfoCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
    borderColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 25,
  },
  additionalInfoTitle: {
    fontFamily: customFont,
    color: '#34D399',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  additionalInfoText: {
    fontFamily: customFont,
    color: '#E2E8F0',
    fontSize: 14,
    lineHeight: 20,
  },
  subsectionTitle: {
    fontFamily: customFont,
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  curiosityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingLeft: 4,
  },
  curiosityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
    marginTop: 8,
    marginRight: 10,
  },
  curiosityText: {
    fontFamily: customFont,
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 16,
    alignItems: 'center',
    marginBottom: 15,
  },
  gridCardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  gridCardText: {
    fontFamily: customFont,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});
