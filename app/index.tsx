import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center"
    >
      <Text className="text-5xl text-dark-200">Movie screen.</Text>
      <Link href="/onboarding">Onboarding</Link>
      <Link href="/movie/avenger555s">Avengers Movie</Link>
    </View>
  );
}
