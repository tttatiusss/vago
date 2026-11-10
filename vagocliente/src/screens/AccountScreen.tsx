import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface AccountOptionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  badge?: string;
  onPress: () => void;
}

const AccountOption: React.FC<AccountOptionProps> = ({ icon, title, badge, onPress }) => (
  <TouchableOpacity style={styles.optionRow} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.optionLeft}>
      <Ionicons name={icon} size={22} color="#000000" />
      <Text style={styles.optionTitle}>{title}</Text>
    </View>
    <View style={styles.optionRight}>
      {badge && (
        <View style={styles.blueBadge}>
          <Text style={styles.blueBadgeText}>{badge}</Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={18} color="#A1A1AA" />
    </View>
  </TouchableOpacity>
);

export const AccountScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Header */}
        <View style={styles.profileHeader}>
          <View>
            <Text style={styles.userName}>Passageiro Vago</Text>
            <View style={styles.ratingBox}>
              <Ionicons name="star" size={14} color="#000000" />
              <Text style={styles.ratingText}>4.95</Text>
            </View>
          </View>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color="#71717A" />
          </View>
        </View>

        {/* Quick Shortcuts */}
        <View style={styles.shortcutsRow}>
          <TouchableOpacity
            style={styles.shortcutCard}
            onPress={() => Alert.alert('Ajuda', 'Central de suporte Vago')}
          >
            <Ionicons name="help-buoy-outline" size={24} color="#000000" />
            <Text style={styles.shortcutText}>Ajuda</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutCard}
            onPress={() => Alert.alert('Pagamento', 'Métodos de pagamento')}
          >
            <Ionicons name="card-outline" size={24} color="#000000" />
            <Text style={styles.shortcutText}>Pagamento</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutCard}
            onPress={() => Alert.alert('Atividades', 'Histórico completo')}
          >
            <Ionicons name="receipt-outline" size={24} color="#000000" />
            <Text style={styles.shortcutText}>Atividades</Text>
          </TouchableOpacity>
        </View>

        {/* Vago Pass / Promo Card */}
        <View style={styles.promoCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.promoTitle}>Vago Pass</Text>
            <Text style={styles.promoSubtitle}>Economize 10% em todas as viagens e entregas</Text>
          </View>
          <TouchableOpacity
            style={styles.promoButton}
            onPress={() => Alert.alert('Vago Pass', 'Assine o Vago Pass com desconto')}
          >
            <Text style={styles.promoButtonText}>Assinar</Text>
          </TouchableOpacity>
        </View>

        {/* Account Options */}
        <View style={styles.optionsList}>
          <AccountOption
            icon="settings-outline"
            title="Configurações"
            onPress={() => Alert.alert('Configurações', 'Configurações da conta')}
          />
          <AccountOption
            icon="notifications-outline"
            title="Mensagens e Alertas"
            badge="1 nova"
            onPress={() => Alert.alert('Notificações', 'Você tem 1 mensagem não lida')}
          />
          <AccountOption
            icon="shield-checkmark-outline"
            title="Segurança e Privacidade"
            onPress={() => Alert.alert('Segurança', 'Recursos de segurança')}
          />
          <AccountOption
            icon="gift-outline"
            title="Indique e Ganhe"
            onPress={() => Alert.alert('Indique', 'Ganhe R$ 20 por amigo indicado')}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 4,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  shortcutCard: {
    flex: 1,
    backgroundColor: '#F4F4F6',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  shortcutText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 12,
    color: '#A1A1AA',
    lineHeight: 16,
  },
  promoButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginLeft: 12,
  },
  promoButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
  },
  optionsList: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E4E4E7',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E4E4E7',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#18181B',
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  blueBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  blueBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
});
