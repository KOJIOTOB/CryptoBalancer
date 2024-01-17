
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from './types/types';
import Home from './screens/Home';
import LoginScreen from './screens/LoginScreen';
import SplashScreen from './screens/SplashScreen';
import GeneralSettings from './screens/footer/GeneralSettings';
import UserSettings from './screens/footer/UserSettings';



const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeScreen') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'UserSettings') {
            iconName = focused ? 'person' : 'person';
          } else if (route.name === 'GeneralSettings') {
            iconName = focused ? 'settings' : 'settings';
          } else {
            iconName = 'circle';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00d7f3',
        tabBarInactiveTintColor: '#000',
        tabBarStyle: {
          borderTopColor: 'transparent',
        },
        tabBarLabelStyle: {
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="HomeScreen" component={Home} />
      <Tab.Screen name="UserSettings" component={UserSettings} />
      <Tab.Screen name="GeneralSettings" component={GeneralSettings} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: 'white',
          },
          animation: 'none',
        }}
        initialRouteName="SplashScreen"
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={MainTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="HomeScreen" component={MainTabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;