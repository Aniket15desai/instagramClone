import { Redirect, Tabs } from "expo-router";
import {Entypo, Feather} from '@expo/vector-icons';
import { useAuth } from "@/src/providers/AuthProvider";

export default function TabsLayout() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Redirect href="/(auth)" />;
    }
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'black', tabBarShowLabel: false}}>
            <Tabs.Screen 
                name="index" 
                options={{ 
                    headerTitle: 'For you', 
                    headerTitleAlign: 'center',
                    headerTitleStyle: {fontSize: 16, fontWeight: 700},
                    tabBarIcon: ({ color }) => 
                        <Entypo name="home" size={26} color={color} />
                }} 
            />
            <Tabs.Screen 
                name="explore" 
                options={{ 
                    headerTitle: 'Explore', 
                    headerTitleAlign: 'center',
                    headerTitleStyle: {fontSize: 16, fontWeight: 700},
                    tabBarIcon: ({ color }) => 
                        <Feather name="search" size={26} color={color} />
                }} 
            />
            <Tabs.Screen 
                name="post" 
                options={{ 
                    headerTitle: 'New Post',
                    headerTitleAlign: 'center',
                    headerTitleStyle: {fontSize: 16, fontWeight: 700},
                    tabBarIcon: ({ color }) => 
                        <Feather name="plus-square" size={26} color={color} />
                }} 
            />
            <Tabs.Screen 
                name="reels" 
                options={{ 
                    headerTitle: 'Reels', 
                    headerTitleAlign: 'center',
                    headerTitleStyle: {fontSize: 16, fontWeight: 700},
                    tabBarIcon: ({ color }) => 
                        <Feather name="instagram" size={26} color={color} />
                }} 
            />
            <Tabs.Screen 
                name="profile" 
                options={{ 
                    headerTitle: 'Profile',
                    headerTitleAlign: 'center',
                    headerTitleStyle: {fontSize: 16, fontWeight: 700},
                    tabBarIcon: ({ color }) => 
                        <Feather name="user" size={26} color={color} />
                }} 
            />
        </Tabs>
    )
}