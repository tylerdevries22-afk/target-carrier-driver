import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { Package, MapPin, Weight, Calendar, DollarSign } from 'lucide-react-native';
import type { RootStackParamList } from '../App';
import type { RouteProp } from '@react-navigation/native';

type ShipmentDetailRouteProp = RouteProp<RootStackParamList, 'ShipmentDetail'>;

export default function ShipmentDetail() {
  const route = useRoute<ShipmentDetailRouteProp>();
  const { shipmentId } = route.params;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Package size={20} color="#60a5fa" />
          <Text style={styles.title}>Load #{shipmentId}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Route</Text>
          <View style={styles.routeRow}>
            <MapPin size={14} color="#94a3b8" />
            <Text style={styles.routeText}>Minneapolis, MN → Chicago, IL</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Details</Text>
          <View style={styles.detailRow}>
            <Weight size={14} color="#94a3b8" />
            <Text style={styles.detailText}>42,000 lbs · Dry Van</Text>
          </View>
          <View style={styles.detailRow}>
            <Calendar size={14} color="#94a3b8" />
            <Text style={styles.detailText}>Pickup: Aug 20, 08:00 AM</Text>
          </View>
          <View style={styles.detailRow}>
            <Calendar size={14} color="#94a3b8" />
            <Text style={styles.detailText}>Delivery: Aug 20, 04:00 PM</Text>
          </View>
          <View style={styles.detailRow}>
            <DollarSign size={14} color="#94a3b8" />
            <Text style={styles.detailText}>Rate: $1,250.00</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Special Instructions</Text>
          <Text style={styles.instructions}>Liftgate required. Call receiver 30 min before arrival. Appointment only.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  scroll: { padding: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '800', color: '#fff' },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#94a3b8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  routeText: { fontSize: 14, color: '#e2e8f0' },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  detailText: { fontSize: 13, color: '#cbd5e1' },
  instructions: { fontSize: 13, color: '#cbd5e1', lineHeight: 20 },
});
