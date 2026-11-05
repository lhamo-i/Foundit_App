import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavigation from '../components/BottomNavigation';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

// Auth screens
import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main tabs
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import PostScreen from '../screens/PostScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Screens that open on top of the tabs
import ItemDetailsScreen from '../screens/ItemDetailsScreen';
import ClaimVerificationScreen from '../screens/claims/ClaimVerificationScreen';
import ClaimSubmittedScreen from '../screens/claims/ClaimSubmittedScreen';
import MyClaimsScreen from '../screens/claims/MyClaimsScreen';
import ClaimDetailsScreen from '../screens/claims/ClaimDetailsScreen';
import AdditionalProofScreen from '../screens/claims/AdditionalProofScreen';
import ClaimRejectedScreen from '../screens/claims/ClaimRejectedScreen';
import RequestReviewScreen from '../screens/claims/RequestReviewScreen';
import DisputeReviewScreen from '../screens/claims/DisputeReviewScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import MyPostsScreen from '../screens/MyPostsScreen';
import SavedItemsScreen from '../screens/SavedItemsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import HelpScreen from '../screens/HelpScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const stackOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.background },
};

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
      <Tab.Screen name="Post" component={PostScreen} />
      <Tab.Screen name="Chat" component={ChatListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Shown when nobody is logged in
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

// Shown after login: the tabs, plus every screen that opens on top of them
function MainStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} />
      <Stack.Screen name="ClaimVerification" component={ClaimVerificationScreen} />
      <Stack.Screen name="ClaimSubmitted" component={ClaimSubmittedScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="MyClaims" component={MyClaimsScreen} />
      <Stack.Screen name="ClaimDetails" component={ClaimDetailsScreen} />
      <Stack.Screen name="AdditionalProof" component={AdditionalProofScreen} />
      <Stack.Screen name="ClaimRejected" component={ClaimRejectedScreen} />
      <Stack.Screen name="RequestReview" component={RequestReviewScreen} />
      <Stack.Screen name="DisputeReview" component={DisputeReviewScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="MyPosts" component={MyPostsScreen} />
      <Stack.Screen name="SavedItems" component={SavedItemsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
    </Stack.Navigator>
  );
}

// Decides what to show: splash -> login screens -> the app.
export default function AppNavigator() {
  const { user, initializing } = useAuth();
  if (initializing) return <SplashScreen />;
  if (!user) return <AuthStack />;
  return <MainStack />;
}
