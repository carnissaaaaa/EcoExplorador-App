import React, { useState, useEffect } from 'react';
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
  Easing, 
  Modal, 
  TextInput 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { biomesData } from '../data/biomesData';
import { useAuth } from '../contexts/AuthContext';

const customFont = Platform.OS === 'web'
  ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  : (Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium');

const ECOLOGICAL_FACTS = [
  "A Caatinga é o único bioma 100% exclusivamente brasileiro, e cerca de 1/3 de suas espécies de plantas não existem em nenhum outro lugar do mundo!",
  "O Rio Amazonas despeja cerca de 175 milhões de litros de água doce no Oceano Atlântico a cada segundo, a maior vazão do planeta!",
  "O Lobo-guará, símbolo do Cerrado, é o maior canídeo da América do Sul. Ele ajuda a reflorestar o bioma espalhando sementes de lobeira.",
  "O Pantanal abriga a maior densidade de jacarés do mundo. Estima-se que existam mais de 10 milhões de jacarés na região.",
  "A Mata Atlântica, embora restando cerca de 12% da área original, concentra 20 mil espécies de plantas (8 mil delas exclusivas/endêmicas).",
  "A Vitória-régia é uma planta gigante da Amazônia cujas folhas circulares podem atingir 2,5 metros de diâmetro e suportar até 40 kg flutuando.",
  "O Pampa Sulino é formado por campos nativos com mais de 3.000 espécies de plantas herbáceas e serve de rota para aves migratórias.",
  "O Tuiuiú é a ave símbolo do Pantanal e constrói ninhos em copas de árvores que podem ultrapassar 1,5 metro de diâmetro e 2 metros de altura."
];

export function HomeScreen({ navigation }: any) {
  const { user, signOut } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [devVisible, setDevVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [factIndex, setFactIndex] = useState(0);

  const handleDevFeature = () => {
    setMenuVisible(false);
    setDevVisible(true);
  };

  const handleLogout = () => {
    setMenuVisible(false);
    signOut();
  };

  const handleBiomePress = (biomeId: string) => {
    navigation.navigate('BiomeDetails', { biomeId });
  };

  const [floatAnim1] = useState(() => new Animated.Value(0));
  const [floatAnim2] = useState(() => new Animated.Value(0));
  const [fadeFactAnim] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const createFloatingAnimation = (anim: Animated.Value, duration: number, offset: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: offset,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          })
        ])
      );
    };

    createFloatingAnimation(floatAnim1, 4500, -20).start();
    createFloatingAnimation(floatAnim2, 5500, 30).start();

    // Rotação de fatos ecológicos
    const factInterval = setInterval(() => {
      Animated.timing(fadeFactAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true
      }).start(() => {
        setFactIndex((prevIndex) => (prevIndex + 1) % ECOLOGICAL_FACTS.length);
        Animated.timing(fadeFactAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true
        }).start();
      });
    }, 8000); // Rotaciona a cada 8 segundos

    return () => {
      clearInterval(factInterval);
    };
  }, [fadeFactAnim, floatAnim1, floatAnim2]);

  // Filtragem dos biomas com base na busca
  const filteredBiomeKeys = Object.keys(biomesData).filter(key => 
    biomesData[key].title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Background Animado */}
      <Animated.View style={[styles.circle1, { transform: [{ translateY: floatAnim1 }] }]} />
      <Animated.View style={[styles.circle2, { transform: [{ translateY: floatAnim2 }] }]} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentWrapper}>

          {/* Cabeçalho */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
              <Ionicons name="menu-outline" size={32} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>EcoExplorador</Text>
            </View>

            <TouchableOpacity style={styles.profileButton} onPress={handleDevFeature}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=11' }}
                style={styles.avatarSmall}
              />
            </TouchableOpacity>
          </View>

          {/* Seção de Pesquisa */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color="#94A3B8" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar biomas do Brasil..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery !== '' && (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Seção de Curiosidade / Fato Ecológico Rotativo */}
          <View style={styles.dashboardContainer}>
            <Text style={styles.sectionTitle}>Você Sabia?</Text>

            <Animated.View style={[styles.factCard, { opacity: fadeFactAnim }]}>
              <View style={styles.factIconBox}>
                <Ionicons name="bulb-outline" size={24} color="#34D399" />
              </View>
              <Text style={styles.factText}>
                {ECOLOGICAL_FACTS[factIndex]}
              </Text>
            </Animated.View>
          </View>

          {/* Lista de Biomas */}
          <View style={styles.biomesContainer}>
            <Text style={styles.sectionTitle}>Explore os Biomas</Text>
            {filteredBiomeKeys.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="leaf-outline" size={40} color="#94A3B8" style={{ marginBottom: 10 }} />
                <Text style={styles.emptyText}>Nenhum bioma encontrado para a busca.</Text>
              </View>
            ) : (
              filteredBiomeKeys.map((key) => {
                const biome = biomesData[key];
                return (
                  <TouchableOpacity 
                    key={key} 
                    style={styles.biomeCard} 
                    onPress={() => handleBiomePress(key)}
                    activeOpacity={0.9}
                  >
                    <Image source={{ uri: biome.image }} style={styles.biomeImage} />
                    <View style={styles.biomeOverlay}>
                      <View style={styles.biomeCardHeader}>
                        <Text style={styles.biomeTitle}>{biome.title}</Text>
                        <View style={styles.deforestationBadge}>
                          <Text style={styles.deforestationBadgeText}>
                            Desmatado: {biome.deforestationRate}%
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.biomeDescription} numberOfLines={2}>
                        {biome.text}
                      </Text>
                      <View style={styles.cardFooter}>
                        <Text style={styles.learnMoreText}>Explorar Bioma</Text>
                        <Ionicons name="arrow-forward-circle" size={24} color="#34D399" />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>

        </View>
      </ScrollView>

      {/* Menu Lateral (Drawer) */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.menuOverlay}>
          <View style={styles.sideMenu}>

            <View style={styles.menuProfileSection}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=11' }}
                style={styles.menuAvatar}
              />
              <Text style={styles.menuUserName}>{user?.username || 'Explorador Padrão'}</Text>
              <Text style={styles.menuUserEmail}>{user?.username ? `${user.username}@exemplo.com` : 'aluno@exemplo.com'}</Text>
            </View>

            <View style={styles.menuItemsContainer}>
              <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                <View style={styles.menuIconBoxActive}>
                  <Ionicons name="leaf-outline" size={22} color="#FFFFFF" />
                </View>
                <Text style={styles.menuItemTextActive}>Biomas do Brasil</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => { setMenuVisible(false); navigation.navigate('InteractiveMap'); }}
              >
                <View style={styles.menuIconBox}>
                  <Ionicons name="stats-chart-outline" size={22} color="#94A3B8" />
                </View>
                <Text style={styles.menuItemText}>Gráfico Interativo</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => { setMenuVisible(false); navigation.navigate('Preservation'); }}
              >
                <View style={styles.menuIconBox}>
                  <Ionicons name="shield-checkmark-outline" size={22} color="#94A3B8" />
                </View>
                <Text style={styles.menuItemText}>Preservação</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleDevFeature}>
                <View style={styles.menuIconBox}>
                  <Ionicons name="information-circle-outline" size={22} color="#94A3B8" />
                </View>
                <Text style={styles.menuItemText}>Sobre o Projeto</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.menuFooter}>
              <TouchableOpacity style={styles.menuLogoutBtn} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={26} color="#F87171" />
                <Text style={styles.menuLogoutText}>Sair da Conta</Text>
              </TouchableOpacity>
            </View>

          </View>
          <TouchableOpacity
            style={styles.menuCloseArea}
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
          />
        </View>
      </Modal>

      {/* Modal Em Desenvolvimento */}
      <Modal
        visible={devVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDevVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={[styles.modalIconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
              <Ionicons name="construct-outline" size={30} color="#10B981" />
            </View>
            <Text style={styles.modalTitle}>Em Desenvolvimento</Text>
            <Text style={[styles.modalText, { marginBottom: 25 }]}>
              Esta funcionalidade estará disponível nas próximas atualizações.
            </Text>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#10B981', shadowColor: '#10B981' }]}
              onPress={() => setDevVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B130E',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  circle1: {
    position: 'absolute',
    top: '10%',
    left: '-5%',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#059669',
    opacity: 0.12,
  },
  circle2: {
    position: 'absolute',
    bottom: '5%',
    right: '-5%',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#10B981',
    opacity: 0.08,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: customFont,
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  profileButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    height: 52,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: customFont,
    fontSize: 16,
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
  dashboardContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontFamily: customFont,
    fontSize: 18,
    fontWeight: '800',
    color: '#E2E8F0',
    marginBottom: 15,
    letterSpacing: -0.5,
  },
  factCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.25)',
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  factIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  factText: {
    flex: 1,
    fontFamily: customFont,
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 18,
  },
  biomesContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  biomeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 20,
    overflow: 'hidden',
  },
  biomeImage: {
    width: '100%',
    height: 180,
  },
  biomeOverlay: {
    padding: 20,
    backgroundColor: 'rgba(11, 19, 14, 0.85)',
  },
  biomeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  biomeTitle: {
    fontFamily: customFont,
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  deforestationBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deforestationBadgeText: {
    fontFamily: customFont,
    color: '#F87171',
    fontSize: 11,
    fontWeight: 'bold',
  },
  biomeDescription: {
    fontFamily: customFont,
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 12,
  },
  learnMoreText: {
    fontFamily: customFont,
    color: '#34D399',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: customFont,
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
  },
  menuOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  menuCloseArea: {
    flex: 1,
  },
  sideMenu: {
    width: 280,
    height: '100%',
    backgroundColor: '#0B130E',
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 20,
  },
  menuProfileSection: {
    paddingHorizontal: 24,
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 10,
  },
  menuAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#10B981',
    marginBottom: 16,
  },
  menuUserName: {
    fontFamily: customFont,
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  menuUserEmail: {
    fontFamily: customFont,
    fontSize: 14,
    color: '#94A3B8',
  },
  menuItemsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 6,
  },
  menuIconBoxActive: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemTextActive: {
    fontFamily: customFont,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  menuItemText: {
    fontFamily: customFont,
    fontSize: 15,
    fontWeight: '600',
    color: '#94A3B8',
  },
  menuFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuLogoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuLogoutText: {
    fontFamily: customFont,
    fontSize: 16,
    fontWeight: '700',
    color: '#F87171',
    marginLeft: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#111C15',
    borderRadius: 28,
    padding: 30,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  modalTitle: {
    fontFamily: customFont,
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  modalText: {
    fontFamily: customFont,
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: '#F87171',
    borderRadius: 30,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#F87171',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalButtonText: {
    fontFamily: customFont,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
