// View is a box. ActivityIndicator is the spinning wheel.
import { ActivityIndicator, StyleSheet, View } from "react-native";

// a full-screen spinner used while data is on the way.
export function LoadingView() {
  return (
    // flex 1 makes the box fill the screen. the other two lines center the spinner.
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color="#3D5AFE" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F6FB",
  },
});
