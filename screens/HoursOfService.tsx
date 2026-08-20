import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, Play, Square, RotateCcw, AlertTriangle, Timer } from 'lucide-react-native';

// DOT Hours of Service rules (simplified)
const HOS_RULES = {
  drivingLimit: 11 * 60, // 11 hours in minutes
  onDutyLimit: 14 * 60, // 14 hours in minutes
  breakRequiredAfter: 8 * 60, // 30-min break after 8 hours
  weeklyLimit: 60 * 60, // 60 hours / 7 days
};

interface HOSState {
  status: 'off_duty' | 'sleeper' | 'driving' | 'on_duty_not_driving';
  drivingMinutes: number;
  onDutyMinutes: number;
  offDutyMinutes: number;
  lastStatusChange: Date;
  cycleMinutes: number;
  breaksTaken: number;
}

export default function HoursOfService() {
  const [state, setState] = useState<HOSState>({
    status: 'off_duty',
    drivingMinutes: 0,
    onDutyMinutes: 0,
    offDutyMinutes: 0,
    lastStatusChange: new Date(),
    cycleMinutes: 0,
    breaksTaken: 0,
  });
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning) {
      interval = setInterval(() => {
        setState((prev) => {
          const now = new Date();
          const elapsed = Math.floor((now.getTime() - prev.lastStatusChange.getTime()) / 60000);
          
          let updates: Partial<HOSState> = {};
          
          if (prev.status === 'driving') {
            updates = { drivingMinutes: prev.drivingMinutes + 1, onDutyMinutes: prev.onDutyMinutes + 1 };
          } else if (prev.status === 'on_duty_not_driving') {
            updates = { onDutyMinutes: prev.onDutyMinutes + 1 };
          } else {
            updates = { offDutyMinutes: prev.offDutyMinutes + 1 };
          }

          // Check violation warnings
          const newDriving = (updates.drivingMinutes || prev.drivingMinutes);
          const newOnDuty = (updates.onDutyMinutes || prev.onDutyMinutes);
          
          if (newDriving >= HOS_RULES.drivingLimit - 30 && newDriving < HOS_RULES.drivingLimit) {
            // Warning approaching limit
          }

          return { ...prev, ...updates };
        });
      }, 60000); // Update every minute
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const changeStatus = (newStatus: HOSState['status']) => {
    setState((prev) => ({
      ...prev,
      status: newStatus,
      lastStatusChange: new Date(),
    }));
    if (newStatus === 'driving' || newStatus === 'on_duty_not_driving') {
      setTimerRunning(true);
    } else {
      setTimerRunning(false);
    }
  };

  const resetDay = () => {
    Alert.alert('Reset Day', 'Clear all HOS counters for a new day?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          setState({
            status: 'off_duty',
            drivingMinutes: 0,
            onDutyMinutes: 0,
            offDutyMinutes: 0,
            lastStatusChange: new Date(),
            cycleMinutes: state.cycleMinutes,
            breaksTaken: 0,
          });
          setTimerRunning(false);
        },
      },
    ]);
  };

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const drivingPercent = Math.min((state.drivingMinutes / HOS_RULES.drivingLimit) * 100, 100);
  const onDutyPercent = Math.min((state.onDutyMinutes / HOS_RULES.onDutyLimit) * 100, 100);

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    off_duty: { label: 'Off Duty', color: '#64748b', icon: Square },
    sleeper: { label: 'Sleeper Berth', color: '#6366f1', icon: Square },
    driving: { label: 'Driving', color: '#22c55e', icon: Play },
    on_duty_not_driving: { label: 'On Duty (Not Driving)', color: '#f59e0b', icon: Clock },
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Current Status */}
        <View style={styles.statusCard}>
          <Text style={styles.sectionLabel}>Current Status</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${statusConfig[state.status].color}20` }]}>
            <View style={[styles.statusDot, { backgroundColor: statusConfig[state.status].color }]} />
            <Text style={[styles.statusText, { color: statusConfig[state.status].color }]}>
              {statusConfig[state.status].label}
            </Text>
          </View>
          <Text style={styles.statusTime}>Since {state.lastStatusChange.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>

        {/* Progress bars */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Daily Limits</Text>
          
          <View style={styles.limitRow}>
            <View style={styles.limitHeader}>
              <Text style={styles.limitLabel}>Driving</Text>
              <Text style={styles.limitValue}>{formatTime(state.drivingMinutes)} / 11h</Text>
            </View>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${drivingPercent}%`, backgroundColor: drivingPercent > 90 ? '#ef4444' : '#22c55e' }]} />
            </View>
          </View>

          <View style={styles.limitRow}>
            <View style={styles.limitHeader}>
              <Text style={styles.limitLabel}>On Duty</Text>
              <Text style={styles.limitValue}>{formatTime(state.onDutyMinutes)} / 14h</Text>
            </View>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${onDutyPercent}%`, backgroundColor: onDutyPercent > 90 ? '#ef4444' : '#3b82f6' }]} />
            </View>
          </View>

          <View style={styles.limitRow}>
            <View style={styles.limitHeader}>
              <Text style={styles.limitLabel}>Off Duty</Text>
              <Text style={styles.limitValue}>{formatTime(state.offDutyMinutes)}</Text>
            </View>
          </View>
        </View>

        {/* Status buttons */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Change Status</Text>
          <View style={styles.buttonGrid}>
            {(Object.keys(statusConfig) as Array<HOSState['status']>).map((status) => {
              const config = statusConfig[status];
              const Icon = config.icon;
              const isActive = state.status === status;
              return (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusBtn,
                    isActive && { backgroundColor: `${config.color}30`, borderColor: config.color },
                  ]}
                  onPress={() => changeStatus(status)}
                >
                  <Icon size={18} color={isActive ? config.color : '#94a3b8'} />
                  <Text style={[styles.statusBtnText, isActive && { color: config.color }]}>{config.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Violation warnings */}
        {(state.drivingMinutes >= HOS_RULES.drivingLimit || state.onDutyMinutes >= HOS_RULES.onDutyLimit) && (
          <View style={styles.warningCard}>
            <AlertTriangle size={18} color="#ef4444" />
            <Text style={styles.warningText}>
              {state.drivingMinutes >= HOS_RULES.drivingLimit
                ? 'Driving limit exceeded. Must take 10-hour break.'
                : 'On-duty limit exceeded. Must take 10-hour break.'}
            </Text>
          </View>
        )}

        {/* Reset */}
        <TouchableOpacity style={styles.resetBtn} onPress={resetDay}>
          <RotateCcw size={14} color="#64748b" />
          <Text style={styles.resetText}>Reset Day</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  content: { padding: 16, gap: 12 },
  statusCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    gap: 8,
  },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, alignSelf: 'flex-start' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 15, fontWeight: '700' },
  statusTime: { fontSize: 12, color: '#64748b' },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  limitRow: { gap: 6 },
  limitHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  limitLabel: { fontSize: 13, fontWeight: '600', color: '#cbd5e1' },
  limitValue: { fontSize: 13, color: '#94a3b8' },
  progressBg: { height: 6, backgroundColor: '#334155', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  buttonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statusBtn: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statusBtnText: { fontSize: 12, fontWeight: '600', color: '#94a3b8' },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ef444420',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ef444440',
  },
  warningText: { fontSize: 12, color: '#ef4444', fontWeight: '600', flex: 1 },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
  },
  resetText: { fontSize: 13, color: '#64748b' },
});
