import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import * as Battery from 'expo-battery';
import { MapPin, Play, Square, Signal, Battery as BatteryIcon } from 'lucide-react-native';
import { API_BASE, API_KEY } from '../App';

const DRIVER_ID = 1; // In production, from auth context

export default function LocationTracker() {
  const [tracking, setTracking] = useState(false);
  const [lastLocation, setLastLocation] = useState<Location.LocationObject | null>(null);
  const [battery, setBattery] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for GPS tracking');
      }
      if (Platform.OS !== 'web') {
        const level = await Battery.getBatteryLevelAsync();
        setBattery(Math.round(level * 100));
      }
    })();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    setTracking(true);
    intervalRef.current = setInterval(async () => {
      try {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
        setLastLocation(loc);
        await fetch(`${API_BASE}/driver/location`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
          body: JSON.stringify({
            driverId: DRIVER_ID,
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            accuracy: loc.coords.accuracy,
            speed: loc.coords.speed,
            heading: loc.coords.heading,
            altitude: loc.coords.altitude,
            batteryLevel: battery ?? undefined,
            recordedAt: new Date().toISOString(),
          }),
        });
      } catch (err) {
        console.error('Location post failed', err);
      }
    }, 30000); // Every 30 seconds
  };

  const stopTracking = () => {
    setTracking(false);
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.statusCard}>
          <View style={[styles.statusDot, { backgroundColor: tracking ? '#22c55e' : '#ef4444' }]} />
          <Text style={styles.statusText}>{tracking ? 'Tracking Active' : 'Tracking Off'}</Text>
          {battery !== null && (
            <View style={styles.batteryRow}>
              <BatteryIcon size={14} color="#94a3b8" />
              <Text style={styles.batteryText}>{battery}%</Text>
            </View>
          )}
        </View>

        <View style={styles.locationCard}>
          <MapPin size={20} color="#60a5fa" />
          <Text style={styles.coordLabel}>Last Known Position</Text>
          {lastLocation ? (
            <>
              <Text style={styles.coord}>{lastLocation.coords.latitude.toFixed(6)}</Text>
              <Text style={styles.coord}>{lastLocation.coords.longitude.toFixed(6)}</Text>
              <Text style={styles.accuracy}>Accuracy: {Math.round(lastLocation.coords.accuracy || 0)}m</Text>
            </>
          ) : (
            <Text style={styles.noLocation}>No location data yet</Text>
          )}
        </View>

        <View style={styles.infoCard}>
          <Signal size={16} color="#94a3b8" />
          <Text style={styles.infoText}>Posts every 30 seconds when active</Text>
          <Text style={styles.infoText}>Uses best available GPS accuracy</Text>
        </View>

        <TouchableOpacity
          style={[styles.toggleBtn, { backgroundColor: tracking ? '#ef4444' : '#22c55e' }]}
          onPress={tracking ? stopTracking : startTracking}
        >
          {tracking ? <Square size={20} color="#fff" /> : <Play size={20} color="#fff" />}
          <Text style={styles.toggleText}>{tracking ? 'Stop Tracking' : 'Start Tracking'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  content: { padding: 16, gap: 16 },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusText: { fontSize: 15, fontWeight: '700', color: '#fff', flex: 1 },
  batteryRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  batteryText: { fontSize: 12, color: '#94a3b8' },
  locationCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    gap: 6,
  },
  coordLabel: { fontSize: 13, color: '#64748b', marginTop: 4 },
  coord: { fontSize: 20, fontWeight: '700', color: '#fff', fontVariant: ['tabular-nums'] },
  accuracy: { fontSize: 12, color: '#22c55e', marginTop: 4 },
  noLocation: { fontSize: 14, color: '#64748b', marginTop: 4 },
  infoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 6,
  },
  infoText: { fontSize: 12, color: '#94a3b8' },
  toggleBtn: {
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  toggleText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
