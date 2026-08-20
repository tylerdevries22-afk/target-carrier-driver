import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Package, Camera, CheckCircle, Clock, Truck } from 'lucide-react-native';
import { API_BASE, API_KEY } from '../App';

const STATUS_EVENTS = [
  { code: 'X1', label: 'Arrived at Pickup', icon: MapPin, color: '#a855f7' },
  { code: 'X3', label: 'Departed Pickup', icon: Truck, color: '#22c55e' },
  { code: 'D1', label: 'In Transit', icon: Truck, color: '#3b82f6' },
  { code: 'X6', label: 'Arrived at Stop', icon: MapPin, color: '#f59e0b' },
  { code: 'X8', label: 'Departed Stop', icon: Truck, color: '#22c55e' },
  { code: 'CD', label: 'Arrived at Delivery', icon: MapPin, color: '#f97316' },
  { code: 'CL', label: 'Delivered', icon: CheckCircle, color: '#22c55e' },
];

export default function ActiveShipment() {
  const [posting, setPosting] = useState(false);

  const postEvent = async (code: string, label: string) => {
    setPosting(true);
    try {
      const res = await fetch(`${API_BASE}/shipments/1/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
        body: JSON.stringify({
          eventType: label,
          eventCode: code,
          recordedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      Alert.alert('Event Posted', `${label} recorded successfully`);
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to post event');
    } finally {
      setPosting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.loadCard}>
          <View style={styles.loadHeader}>
            <Package size={18} color="#60a5fa" />
            <Text style={styles.loadTitle}>Load #TGT-28471</Text>
          </View>
          <View style={styles.route}>
            <Text style={styles.city}>Minneapolis, MN</Text>
            <Text style={styles.arrow}>→</Text>
            <Text style={styles.city}>Chicago, IL</Text>
          </View>
          <View style={styles.metaRow}>
            <Clock size={12} color="#64748b" />
            <Text style={styles.meta}>Est. delivery: Today 4:00 PM</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Update Status</Text>
        <View style={styles.eventsGrid}>
          {STATUS_EVENTS.map((ev) => {
            const Icon = ev.icon;
            return (
              <TouchableOpacity
                key={ev.code}
                style={[styles.eventBtn, posting && { opacity: 0.5 }]}
                onPress={() => postEvent(ev.code, ev.label)}
                disabled={posting}
              >
                <View style={[styles.eventIcon, { backgroundColor: `${ev.color}20` }]}>
                  <Icon size={20} color={ev.color} />
                </View>
                <Text style={styles.eventLabel}>{ev.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.photoBtn} onPress={() => Alert.alert('Camera', 'Photo capture not implemented in preview')}>
          <Camera size={18} color="#fff" />
          <Text style={styles.photoBtnText}>Take Delivery Photo</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  scroll: { padding: 16, paddingBottom: 40 },
  loadCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  loadHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  loadTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  route: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  city: { fontSize: 14, fontWeight: '600', color: '#e2e8f0' },
  arrow: { fontSize: 14, color: '#64748b' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta: { fontSize: 12, color: '#64748b' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 12 },
  eventsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  eventBtn: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    gap: 8,
  },
  eventIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  eventLabel: { fontSize: 12, fontWeight: '600', color: '#cbd5e1', textAlign: 'center' },
  photoBtn: {
    marginTop: 20,
    backgroundColor: '#3b82f6',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
