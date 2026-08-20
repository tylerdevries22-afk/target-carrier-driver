import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Truck, MapPin, Package, User, Clock, AlertCircle, Calendar, Timer, Navigation } from 'lucide-react-native';
import type { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Shipment {
  id: number;
  targetLoadId: string | null;
  status: string;
  origin: { city: string; state: string };
  destination: { city: string; state: string };
  estimatedPickupAt: string | null;
  estimatedDeliveryAt: string | null;
}

export default function DriverHome() {
  const navigation = useNavigation<NavigationProp>();
  const [activeShipment, setActiveShipment] = useState<Shipment | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setActiveShipment(null);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const onRefresh = () => { setRefreshing(true); loadData(); };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#60a5fa" />}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning, Driver</Text>
          <Text style={styles.subtitle}>Target Carrier Partner</Text>
        </View>

        {activeShipment ? (
          <TouchableOpacity
            style={styles.activeCard}
            onPress={() => navigation.navigate('ActiveShipment')}
          >
            <View style={styles.cardHeader}>
              <Package size={20} color="#60a5fa" />
              <Text style={styles.cardTitle}>Active Load</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{activeShipment.status.replace('_', ' ')}</Text>
              </View>
            </View>
            <View style={styles.routeRow}>
              <MapPin size={14} color="#94a3b8" />
              <Text style={styles.routeText}>{activeShipment.origin.city}, {activeShipment.origin.state}</Text>
            </View>
            <View style={styles.routeRow}>
              <MapPin size={14} color="#60a5fa" />
              <Text style={styles.routeText}>{activeShipment.destination.city}, {activeShipment.destination.state}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyCard}>
            <AlertCircle size={24} color="#64748b" />
            <Text style={styles.emptyText}>No active load assigned</Text>
            <Text style={styles.emptySub}>Check your schedule for upcoming loads</Text>
          </View>
        )}

        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Schedule')}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(59,130,246,0.1)' }]}>
              <Calendar size={24} color="#3b82f6" />
            </View>
            <Text style={styles.gridLabel}>My Schedule</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('ActiveShipment')}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(34,197,94,0.1)' }]}>
              <Truck size={24} color="#22c55e" />
            </View>
            <Text style={styles.gridLabel}>Active Load</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('LocationTracker')}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(96,165,250,0.1)' }]}>
              <MapPin size={24} color="#60a5fa" />
            </View>
            <Text style={styles.gridLabel}>GPS Tracking</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('HoursOfService')}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(245,158,11,0.1)' }]}>
              <Timer size={24} color="#f59e0b" />
            </View>
            <Text style={styles.gridLabel}>Hours of Service</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('RoutePlanner', { shipmentId: 1 })}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(168,85,247,0.1)' }]}>
              <Navigation size={24} color="#a855f7" />
            </View>
            <Text style={styles.gridLabel}>Route Plan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Profile')}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(236,72,153,0.1)' }]}>
              <User size={24} color="#ec4899" />
            </View>
            <Text style={styles.gridLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  scroll: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 20 },
  greeting: { fontSize: 24, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 2 },
  activeCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#fff', flex: 1 },
  badge: { backgroundColor: 'rgba(96,165,250,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#60a5fa', textTransform: 'capitalize' },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  routeText: { fontSize: 13, color: '#94a3b8' },
  emptyCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    gap: 8,
  },
  emptyText: { fontSize: 15, fontWeight: '600', color: '#94a3b8' },
  emptySub: { fontSize: 12, color: '#475569' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: {
    width: '47%',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    gap: 8,
  },
  iconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  gridLabel: { fontSize: 13, fontWeight: '600', color: '#cbd5e1' },
});
