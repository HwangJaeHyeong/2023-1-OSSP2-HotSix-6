import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import MainScreen from '../screens/MainScreen';
import GroupScreen from '../screens/GroupScreen';
import TimetableScreen from '../screens/TimetableScreen';
import InsertScreen from '../screens/InsertScreen';
import EmailVerificationScreen from '../screens/VerificationScreen';
import CreateNewgroupScreen from '../screens/CreateNewgroupScreen';
import AgreementScreen from '../screens/AgreementScreen';
import JoinGroupScreen from '../screens/JoinGroupScreen';
import ManageGroupScreen from '../screens/ManageGroupScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Group" component={GroupScreen} />
        <Stack.Screen name="Timetable" component={TimetableScreen} />
        <Stack.Screen name="Insert" component={InsertScreen} />
        <Stack.Screen name="Verification" component={EmailVerificationScreen} />
        <Stack.Screen name="Makegroup" component={CreateNewgroupScreen} />
        <Stack.Screen name="Agreement" component={AgreementScreen} />
        <Stack.Screen name="JoinGroup" component={JoinGroupScreen} />
        <Stack.Screen name="ManageGroup" component={ManageGroupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;