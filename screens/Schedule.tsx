import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Calendar, Clock, MapPin, Truck, ChevronRight, AlertCircle } from 'lucide-react-native';
import type { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ScheduledLoad {
  id: number;
  targetLoadId: string;
  status: string;
  origin: { name: string; city: string; state: string; appointmentDate: string; appointmentTime: string };
  destination: { name: string; city: string; state: string; appointmentDate: string; appointmentTime: string };
  estimatedPickupAt: string;
  estimatedDeliveryAt: string;
  commodity: string;
  weightLbs: number;
  equipmentType: string;
}

// Mock data for demo — replace with API call
const MOCK_SCHEDULE: ScheduledLoad[] = [
  {
    id: 1,
    targetLoadId: 'TGT-28471',
    status: 'dispatched',
    origin: { name: 'Target DC 0601', city: 'Minneapolis', state: 'MN', appointmentDate: '2026-08-20', appointmentTime: '08:00' },
    destination: { name: 'Target Store 0284', city: 'Chicago', state: 'IL', appointmentDate: '2026-08-20', appointmentTime: '16:00' },
    estimatedPickupAt: '2026-08-20T08:00:00Z',
    estimatedDeliveryAt: '2026-08-20T16:00:00Z',
    commodity: 'General Merchandise',
    weightLbs: 42000,
    equipmentType: 'Dry Van',
  },
  {
    id: 2,
    targetLoadId: 'TGT-28492',
    status: 'tendered',
    origin: { name: 'Target DC 0601', city: 'Minneapolis', state: 'MN', appointmentDate: '2026-08-21', appointmentTime: '06:00' },
    destination: { name: 'Target Store 0156', city: 'Milwaukee', state: 'WI', appointmentDate: '2026-08-21', appointmentTime: '14:00' },
    estimatedPickupAt: '2026-08-21T06:00:00Z',
    estimatedDeliveryAt: '2026-08-21T14:00:00Z',
    commodity: 'Frozen Foods',
    weightLbs: 38000,
    equipmentType: 'Reefer',
  },
  {
    id: 3,
    targetLoadId: 'TGT-28504',
    status: 'tendered',
    origin: { name: 'Target DC 0422', city: 'Des Moines', state: 'IA', appointmentDate: '2026-08-22', appointmentTime: '09:00' },
    destination: { name: 'Target Store 0311', city: 'St. Louis', state: 'MO', appointmentDate: '2026-08-22', appointmentTime: '18:00' },
    estimatedPickupAt: '2026-08-22T09:00:00Z',
    estimatedDeliveryAt: '2026-08-22T18:00:00Z',
    commodity: 'General Merchandise',
    weightLbs: 45000,
    equipmentType: 'Dry Van',
  },
];

const statusColors: Record<string, string> = {
  dispatched: '#22c55e',
  tendered: '#f59e0b',
  accepted: '#3b82f6',
  in_transit: '#6366f1',
  delivered: '#10b981',
};

export default function Schedule() {
  const navigation = useNavigation<NavigationProp>();
  const [loads, setLoads] = useState<ScheduledLoad[]>(MOCK_SCHEDULE);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-20');

  const dates = ['2026-08-20', '2026-08-21', '2026-08-22', '2026-08-23'];
  const dateLabels: Record<string, string> = {
    '2026-08-20': 'Today',
    '2026-08-21': 'Tomorrow',
    '2026-08-22': 'Fri',
    '2026-08-23': 'Sat',
  };

  const filtered = loads.filter((l) =>
    l.origin.appointmentDate === selectedDate || l.destination.appointmentDate === selectedDate
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#60a5fa" />}
      >
        {/* Date selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateBar}>
          {dates.map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.datePill, selectedDate === d && styles.datePillActive]}
              onPress={() => setSelectedDate(d)}
            >
              <Text style={[styles.datePillLabel, selectedDate === d && styles.datePillLabelActive]}>
                {dateLabels[d] || d.slice(5)}
              </Text>
              <Text style={[styles.datePillSub, selectedDate === d && styles.datePillLabelActive]}>
                {d.slice(8)}/{d.slice(5, 7)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Timeline */}
        <View style={styles.timeline}>
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <AlertCircle size={24} color="#64748b" />
              <Text style={styles.emptyText}>No loads scheduled</Text>
            </View>
          ) : (
            filtered.map((load, idx) => {
              const isFirst = idx === 0;
              return (
                <TouchableOpacity
                  key={load.id}
                  style={styles.loadCard}
                  onPress={() => navigation.navigate('RoutePlanner', { shipmentId: load.id })}
                >
                  {/* Timeline connector */}
                  <View style={styles.timelineLeft}>
                    <View style={[styles.dot, { backgroundColor: statusColors[load.status] || '#64748b' }]} />
                    {!isFirst && <View style={styles.connector} />}
                  </View>

                  <View style={styles.loadContent}>
                    {/* Header */}
                    <View style={styles.loadHeader}>
                      <Truck size={14} color={statusColors[load.status] || '#64748b'} />
                      <Text style={styles.loadId}>{load.targetLoadId}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: `${statusColors[load.status]}20` }]}>
                        <Text style={[styles.statusText, { color: statusColors[load.status] }]}>{load.status}</Text>
                      </View>
                    </View>

                    {/* Route */}
                    <View style={styles.routeSection}>
                      <View style={styles.stopRow}>
                        <View style={styles.stopDot} />
                        <View style={styles.stopInfo}>
                          <Text style={styles.stopName}>{load.origin.name}</Text>
                          <Text style={styles.stopMeta}>{load.origin.city}, {load.origin.state}</Text>
                          <View style={styles.timeRow}>
                            <Clock size={10} color="#60a5fa" />
                            <Text style={styles.timeText}>Pickup {load.origin.appointmentTime}</Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.stopConnector} />

                      <View style={styles.stopRow}>
                        <View style={[styles.stopDot, { backgroundColor: '#22c55e' }]} />
                        <View style={styles.stopInfo}>
                          <Text style={styles.stopName}>{load.destination.name}</Text>
                          <Text style={styles.stopMeta}>{load.destination.city}, {load.destination.state}</Text>
                          <View style={styles.timeRow}>
                            <Clock size={10} color="#22c55e" />
                            <Text style={styles.timeText}>Delivery {load.destination.appointmentTime}</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.loadFooter}>
                      <Text style={styles.footerText}>{load.commodity} · {load.weightLbs.toLocaleString()} lbs</Text>
                      <Text style={styles.footerText}>{load.equipmentType}</Text>
                    </View>
                  </View>

                  <ChevronRight size={16} color="#475569" />
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  scroll: { padding: 16, paddingBottom: 40 },
  dateBar: { flexDirection: 'row', gap: 8, marginBottom: 20, paddingHorizontal: 4 },
  datePill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  datePillActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  datePillLabel: { fontSize: 13, fontWeight: '700', color: '#94a3b8' },
  datePillLabelActive: { color: '#fff' },
  datePillSub: { fontSize: 11, color: '#64748b', marginTop: 2 },
  timeline: { gap: 0 },
  empty: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyText: { fontSize: 14, color: '#64748b' },
  loadCard: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'flex-start',
  },
  timelineLeft: {
    width: 20,
    alignItems: 'center',
    marginRight: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#0a0f1e',
  },
  connector: {
    width: 2,
    flex: 1,
    backgroundColor: '#334155',
    marginTop: 4,
  },
  loadContent: { flex: 1 },
  loadHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  loadId: { fontSize: 14, fontWeight: '700', color: '#fff', flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '700', textTransform: 'capitalize' },
  routeSection: { gap: 0 },
  stopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  stopDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3b82f6', marginTop: 4 },
  stopInfo: { flex: 1, gap: 1 },
  stopName: { fontSize: 13, fontWeight: '600', color: '#e2e8f0' },
  stopMeta: { fontSize: 11, color: '#64748b' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  timeText: { fontSize: 11, color: '#94a3b8' },
  stopConnector: { width: 2, height: 16, backgroundColor: '#334155', marginLeft: 3, marginVertical: 2 },
  loadFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  footerText: { fontSize: 11, color: '#64748b' },
});
