import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Login_Signup/LoginScreen';
import AgreementScreen from '../screens/Login_Signup/AgreementScreen';
import SignupScreen from '../screens/Login_Signup/SignupScreen';
import EmailVerificationScreen from '../screens/Login_Signup/VerificationScreen';
import MainScreen from '../screens/Main/MainScreen';
import ManageGroupScreen from '../screens/Group/ManageGroupScreen';
import GroupScreen from '../screens/Group/GroupScreen';
import CreateNewgroupScreen from '../screens/Group/CreateNewgroupScreen';
import JoinGroupScreen from '../screens/Group/JoinGroupScreen';
import TimetableScreen from '../screens/TimeTable/TimetableScreen';
import InsertPhotoScreen from '../screens/TimeTable/InsertPhotoScreen';
import InsertTextScreen from '../screens/TimeTable/InsertTextScreen';
import RegisterScreen from '../screens/TimeTable/RegisterScreen';
import RankingScreen from '../screens/TimeTable/RankingScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Agreement" component={AgreementScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Verification" component={EmailVerificationScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="ManageGroup" component={ManageGroupScreen} />
        <Stack.Screen name="Group" component={GroupScreen} />
        <Stack.Screen name="Makegroup" component={CreateNewgroupScreen} />
        <Stack.Screen name="JoinGroup" component={JoinGroupScreen} />
        <Stack.Screen name="Timetable" component={TimetableScreen} />
        <Stack.Screen name="InsertPhoto" component={InsertPhotoScreen} />
        <Stack.Screen name="InsertText" component={InsertTextScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Ranking" component={RankingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;