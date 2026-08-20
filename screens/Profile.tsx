import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Phone, Mail, Shield, LogOut } from 'lucide-react-native';

export default function Profile() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.avatar}>
          <User size={32} color="#60a5fa" />
        </View>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.id}>Driver ID: TGT-DRV-28471</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Mail size={14} color="#94a3b8" />
            <Text style={styles.rowText}>john.doe@targetcarrier.com</Text>
          </View>
          <View style={styles.row}>
            <Phone size={14} color="#94a3b8" />
            <Text style={styles.rowText}>+1 (612) 555-0199</Text>
          </View>
          <View style={styles.row}>
            <Shield size={14} color="#94a3b8" />
            <Text style={styles.rowText}>CDL-A · Minnesota</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={() => Alert.alert('Logout', 'Are you sure?', [{ text: 'Cancel' }, { text: 'Logout' }])}>
          <LogOut size={16} color="#ef4444" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  content: { padding: 16, alignItems: 'center', gap: 12 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#334155',
  },
  name: { fontSize: 20, fontWeight: '800', color: '#fff', marginTop: 4 },
  id: { fontSize: 12, color: '#64748b' },
  card: {
    width: '100%',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
    marginTop: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowText: { fontSize: 13, color: '#cbd5e1' },
  logoutBtn: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 12,
  },
  logoutText: { fontSize: 14, fontWeight: '600', color: '#ef4444' },
});
