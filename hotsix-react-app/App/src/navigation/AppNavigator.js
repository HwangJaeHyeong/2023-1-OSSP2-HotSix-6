import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/Login_Signup/HomeScreen';
import LoginScreen from '../screens/Login_Signup/LoginScreen';
import AgreementScreen from '../screens/Login_Signup/AgreementScreen';
import SignupScreen from '../screens/Login_Signup/SignupScreen';
import EmailVerificationScreen from '../screens/Login_Signup/VerificationScreen';
import MainScreen from '../screens/Main/MainScreen';
import GroupScreen from '../screens/Group/GroupScreen';
import CreateNewgroupScreen from '../screens/Group/CreateNewgroupScreen';
import JoinGroupScreen from '../screens/Group/JoinGroupScreen';
import GroupDetailsScreen from '../screens/Group/GroupDetailsScreen';
import GroupTimeTableScreen from '../screens/Group/GroupTimeTableScreen';
import GroupProgressScreen from '../screens/Group/GroupProgressScreen';
import GroupTasksScreen from '../screens/Group/GroupTasksScreen';
import GroupNoticeScreen from '../screens/Group/GroupNoticeScreen';
import TimetableScreen from '../screens/TimeTable/TimetableScreen';
import InsertPhotoScreen from '../screens/TimeTable/InsertPhotoScreen';
import RegisterScreen from '../screens/TimeTable/RegisterScreen';
import RankingScreen from '../screens/TimeTable/RankingScreen';
import InsertIcsScreen from '../screens/TimeTable/InsertIcsScreen';
import MyPageScreen from '../screens/Login_Signup/MyPageScreen';



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const TabNavigator = () => {
  
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{headerShown: false}} >
        <Tab.Screen name="home" component={AppNavigator} options={{tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size}/>
            ),
          }}
        />
         <Tab.Screen name="menu" component={MainScreen} options={{tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="menu" color={color} size={size}/>
            ),
          }}
        />
        <Tab.Screen name="my page" component={MyPageScreen} options={{tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" color={color} size={size}/>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const AppNavigator = () => {
 
  return (
    <Stack.Navigator initialRouteName="Home"  screenOptions={{ 
      headerStyle: { backgroundColor: '#3679A4' }, 
      headerTintColor: 'white', 
    }}>
        <Stack.Screen name="Home" component={HomeScreen}  options={{ headerShown: false}} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Agreement" component={AgreementScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Verification" component={EmailVerificationScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Group" component={GroupScreen} />
        <Stack.Screen name="Makegroup" component={CreateNewgroupScreen} />
        <Stack.Screen name="JoinGroup" component={JoinGroupScreen} />
        <Stack.Screen name="GroupDetails" component={GroupDetailsScreen} />
        <Stack.Screen name="GroupProgress" component={GroupProgressScreen} />
        <Stack.Screen name="GroupTimeTable" component={GroupTimeTableScreen} /> 
        <Stack.Screen name="GroupTasks" component={GroupTasksScreen} />
        <Stack.Screen name="GroupNotice" component={GroupNoticeScreen} />
        <Stack.Screen name="Timetable" component={TimetableScreen} />
        <Stack.Screen name="InsertPhoto" component={InsertPhotoScreen} />
        <Stack.Screen name="InsertIcs" component={InsertIcsScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Ranking" component={RankingScreen} />
        <Stack.Screen name="MyPage" component={MyPageScreen} />
        
    </Stack.Navigator>
  );
};

export default TabNavigator;