import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DriverHome from './screens/DriverHome';
import ActiveShipment from './screens/ActiveShipment';
import LocationTracker from './screens/LocationTracker';
import ShipmentDetail from './screens/ShipmentDetail';
import Profile from './screens/Profile';

export type RootStackParamList = {
  Home: undefined;
  ActiveShipment: undefined;
  LocationTracker: undefined;
  ShipmentDetail: { shipmentId: number };
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'https://your-admin-portal.com/api';
const API_KEY = process.env.EXPO_PUBLIC_API_KEY || '';

export { API_BASE, API_KEY };

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#0a0f1e' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: '#0a0f1e' },
          }}
        >
          <Stack.Screen name="Home" component={DriverHome} options={{ title: 'Target Carrier' }} />
          <Stack.Screen name="ActiveShipment" component={ActiveShipment} options={{ title: 'Active Load' }} />
          <Stack.Screen name="LocationTracker" component={LocationTracker} options={{ title: 'GPS Tracking' }} />
          <Stack.Screen name="ShipmentDetail" component={ShipmentDetail} options={{ title: 'Load Details' }} />
          <Stack.Screen name="Profile" component={Profile} options={{ title: 'Driver Profile' }} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
