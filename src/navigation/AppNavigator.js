import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavigation from '../components/BottomNavigation';
import ScreenPlaceholder from '../components/ScreenPlaceholder';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import PostItemScreen from '../screens/PostItemScreen';
import ItemDetailsScreen from '../screens/ItemDetailsScreen';
import ClaimScreen from '../screens/ClaimScreen';
import ClaimSubmittedScreen from '../screens/ClaimSubmittedScreen';
import ClaimManagementScreen from '../screens/ClaimManagementScreen';
import ClaimReviewScreen from '../screens/ClaimReviewScreen';
import AdditionalProofScreen from '../screens/AdditionalProofScreen';
import ClaimRejectedScreen from '../screens/ClaimRejectedScreen';
import RequestReviewScreen from '../screens/RequestReviewScreen';
import DisputeStatusScreen from '../screens/DisputeStatusScreen';
import DisputeScreen from '../screens/DisputeScreen';
import ProfileTempScreen from '../screens/ProfileTempScreen';
import { colors } from '../theme/colors';

// TEMPORARY screens. They are replaced by real screens in the next part of Stage 2.
const ChatScreen = () => <ScreenPlaceholder title="Chat" icon="chatbubbles-outline" />;

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// The five bottom tabs. The names must match the ones in BottomNavigation.js.
function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomNavigation {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Post" component={PostItemScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileTempScreen} />
    </Tab.Navigator>
  );
}

// The main stack. Screens here open on top of everything else.
// Splash, Login, Register and ForgotPassword come before the tabs.
export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} />
      <Stack.Screen name="Claim" component={ClaimScreen} />
      <Stack.Screen name="ClaimSubmitted" component={ClaimSubmittedScreen} />
      <Stack.Screen name="ClaimManagement" component={ClaimManagementScreen} />
      <Stack.Screen name="ClaimReview" component={ClaimReviewScreen} />
      <Stack.Screen name="AdditionalProof" component={AdditionalProofScreen} />
      <Stack.Screen name="ClaimRejected" component={ClaimRejectedScreen} />
      <Stack.Screen name="RequestReview" component={RequestReviewScreen} />
      <Stack.Screen name="DisputeStatus" component={DisputeStatusScreen} />
      <Stack.Screen name="DisputeManagement" component={DisputeScreen} />
    </Stack.Navigator>
  );
}
