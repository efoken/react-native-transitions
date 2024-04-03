import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Fade, Grow, Slide, Zoom } from "react-native-transitions";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
  },
  boxGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  box: {
    backgroundColor: "#ccc",
    height: 100,
    width: 100,
  },
});

export default function App() {
  const [checked, setChecked] = useState(false);

  return (
    <View style={styles.container}>
      <Text onPress={() => setChecked((prevChecked) => !prevChecked)}>
        Open up App.tsx to start working on your app!
      </Text>
      <View style={styles.boxGrid}>
        <Grow in={checked}>
          <Animated.View style={styles.box} />
        </Grow>
        <Fade in={checked}>
          <Animated.View style={styles.box} />
        </Fade>
        <Zoom in={checked} onExited={() => console.log("onZoomExit")}>
          <Animated.View style={styles.box} />
        </Zoom>
        <Slide in={checked} onExited={() => console.log("onSlideExit")}>
          <Animated.View style={styles.box} />
        </Slide>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
