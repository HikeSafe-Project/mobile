import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            router.replace('/(auth)/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }
    return (
        <SafeAreaView>
            <Text>Profile</Text>
            <TouchableOpacity onPress={handleLogout}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}