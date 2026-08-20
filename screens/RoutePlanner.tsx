import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { MapPin, Clock, Navigation, Phone, Package, AlertCircle } from 'lucide-react-native';
import type { RootStackParamList } from '../App';
import type { RouteProp } from '@react-navigation/native';

type RoutePlannerRouteProp = RouteProp<RootStackParamList, 'RoutePlanner'>;

interface RouteStop {
  type: 'pickup' | 'delivery' | 'rest' | 'fuel';
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  appointmentTime: string;
  lat: number;
  lng: number;
  instructions: string;
  contactPhone?: string;
}

// Mock route data
const ROUTE_STOPS: RouteStop[] = [
  {
    type: 'pickup',
    name: 'Target Distribution Center 0601',
    address: '5601 E River Rd',
    city: 'Minneapolis',
    state: 'MN',
    zip: '55432',
    appointmentTime: '08:00 AM',
    lat: 45.065,
    lng: -93.265,
    instructions: 'Check in at guard shack. Have BOL ready. Dock 14.',
    contactPhone: '(612) 555-0100',
  },
  {
    type: 'rest',
    name: 'Pilot Travel Center',
    address: 'I-94 Exit 180',
    city: 'Eau Claire',
    state: 'WI',
    zip: '54701',
    appointmentTime: '11:30 AM',
    lat: 44.786,
    lng: -91.461,
    instructions: '30-minute break. Fuel if needed.',
  },
  {
    type: 'fuel',
    name: 'Love\'s Travel Stop',
    address: 'I-90 Exit 45',
    city: 'Madison',
    state: 'WI',
    zip: '53718',
    appointmentTime: '01:00 PM',
    lat: 43.073,
    lng: -89.401,
    instructions: 'Fuel and pre-trip inspection.',
  },
  {
    type: 'delivery',
    name: 'Target Store 0284',
    address: '1200 N Clybourn Ave',
    city: 'Chicago',
    state: 'IL',
    zip: '60610',
    appointmentTime: '04:00 PM',
    lat: 41.907,
    lng: -87.649,
    instructions: 'Receiver dock. Call 30 min before arrival. Appointment required. Use dock B.',
    contactPhone: '(312) 555-0200',
  },
];

const TOTAL_DISTANCE = 408; // miles
const ESTIMATED_DURATION = 480; // minutes

export default function RoutePlanner() {
  const route = useRoute<RoutePlannerRouteProp>();
  const { shipmentId } = route.params;
  const [expandedStop, setExpandedStop] = useState<number | null>(0);

  const toggleStop = (idx: number) => {
    setExpandedStop(expandedStop === idx ? null : idx);
  };

  const stopColors: Record<string, string> = {
    pickup: '#3b82f6',
    delivery: '#22c55e',
    rest: '#f59e0b',
    fuel: '#a855f7',
  };

  const stopLabels: Record<string, string> = {
    pickup: 'Pickup',
    delivery: 'Delivery',
    rest: 'Rest Break',
    fuel: 'Fuel Stop',
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Trip summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Trip Summary</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Navigation size={16} color="#60a5fa" />
              <Text style={styles.summaryValue}>{TOTAL_DISTANCE} mi</Text>
              <Text style={styles.summaryLabel}>Distance</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Clock size={16} color="#22c55e" />
              <Text style={styles.summaryValue}>{Math.floor(ESTIMATED_DURATION / 60)}h {ESTIMATED_DURATION % 60}m</Text>
              <Text style={styles.summaryLabel}>Est. Time</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Package size={16} color="#f59e0b" />
              <Text style={styles.summaryValue}>#{shipmentId}</Text>
              <Text style={styles.summaryLabel}>Load ID</Text>
            </View>
          </View>
        </View>

        {/* Route timeline */}
        <Text style={styles.sectionTitle}>Route Plan</Text>
        <View style={styles.timeline}>
          {ROUTE_STOPS.map((stop, idx) => {
            const isExpanded = expandedStop === idx;
            const isLast = idx === ROUTE_STOPS.length - 1;
            const color = stopColors[stop.type];

            return (
              <TouchableOpacity key={idx} onPress={() => toggleStop(idx)} activeOpacity={0.8}>
                <View style={styles.stopCard}>
                  {/* Connector line */}
                  {!isLast && <View style={styles.connector} />}

                  {/* Dot */}
                  <View style={[styles.stopDot, { backgroundColor: color, borderColor: `${color}40` }]}>
                    <View style={[styles.stopDotInner, { backgroundColor: color }]} />
                  </View>

                  {/* Content */}
                  <View style={styles.stopContent}>
                    <View style={styles.stopHeader}>
                      <View style={styles.stopTypeRow}>
                        <View style={[styles.typeBadge, { backgroundColor: `${color}20` }]}>
                          <Text style={[styles.typeText, { color }]}>{stopLabels[stop.type]}</Text>
                        </View>
                        <Text style={styles.appointmentTime}>{stop.appointmentTime}</Text>
                      </View>
                      <Text style={styles.stopName}>{stop.name}</Text>
                      <Text style={styles.stopAddress}>{stop.address}, {stop.city}, {stop.state} {stop.zip}</Text>
                    </View>

                    {isExpanded && (
                      <View style={styles.stopDetails}>
                        <View style={styles.detailRow}>
                          <MapPin size={12} color="#64748b" />
                          <Text style={styles.detailText}>{stop.lat.toFixed(4)}, {stop.lng.toFixed(4)}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <AlertCircle size={12} color="#f59e0b" />
                          <Text style={styles.detailText}>{stop.instructions}</Text>
                        </View>
                        {stop.contactPhone && (
                          <View style={styles.detailRow}>
                            <Phone size={12} color="#22c55e" />
                            <Text style={styles.detailText}>{stop.contactPhone}</Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  scroll: { padding: 16, paddingBottom: 40 },
  summaryCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  summaryTitle: { fontSize: 14, fontWeight: '700', color: '#94a3b8', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  summaryItem: { alignItems: 'center', gap: 4, flex: 1 },
  summaryValue: { fontSize: 16, fontWeight: '800', color: '#fff' },
  summaryLabel: { fontSize: 11, color: '#64748b' },
  summaryDivider: { width: 1, height: 30, backgroundColor: '#334155' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 12 },
  timeline: { gap: 0 },
  stopCard: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
    position: 'relative',
  },
  connector: {
    position: 'absolute',
    left: 27,
    top: 50,
    width: 2,
    height: 30,
    backgroundColor: '#334155',
    zIndex: 0,
  },
  stopDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    zIndex: 1,
  },
  stopDotInner: { width: 10, height: 10, borderRadius: 5 },
  stopContent: { flex: 1 },
  stopHeader: { gap: 2 },
  stopTypeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  typeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  appointmentTime: { fontSize: 12, fontWeight: '600', color: '#94a3b8' },
  stopName: { fontSize: 14, fontWeight: '700', color: '#fff' },
  stopAddress: { fontSize: 11, color: '#64748b', marginTop: 1 },
  stopDetails: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#334155', gap: 6 },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  detailText: { fontSize: 11, color: '#94a3b8', flex: 1, lineHeight: 16 },
});
