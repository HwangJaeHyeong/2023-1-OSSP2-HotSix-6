import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import MainScreen from '../screens/MainScreen';
import GroupScreen from '../screens/GroupScreen';
import TimetableScreen from '../screens/TimetableScreen';
import EmailVerificationScreen from '../screens/VerificationScreen';
import CreateNewgroupPage from '../screens/CreateNewgroupScreen';
import AgreementScreen from '../screens/AgreementScreen';
import InsertScreen from '../screens/InsertScreen';
import JoinGroupPage from '../screens/JoinGroupScreen';
import HomeScreen from '../screens/HomeScreen';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const TabNavigator = () => {
  
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{headerShown: false, }}>
        <Tab.Screen name="Home" component={AppNavigator} options={{tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size}/>
            ),
          }}
        />
         <Tab.Screen name="back" component={AppNavigator} options={({ navigation }) => ({ tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="arrow-left" color={color} size={size} onPress={() => navigation.goBack()}/>
            ),
          })}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const AppNavigator = () => {
 
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="Group" component={GroupScreen} />
      <Stack.Screen name="Timetable" component={TimetableScreen} />
      <Stack.Screen name="Insert" component={InsertScreen} />
      <Stack.Screen name="Verification" component={EmailVerificationScreen} />
      <Stack.Screen name="Makegroup" component={CreateNewgroupPage} />
      <Stack.Screen name="Agreement" component={AgreementScreen} />
      <Stack.Screen name="JoinGroup" component={JoinGroupPage} />
     
    </Stack.Navigator>
  );
};

export default TabNavigator;
