import { StatusBar } from "expo-status-bar";
import { StrictMode, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Collapse, Fade, Grow, Slide, Zoom } from "react-native-transitions";

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
    <StrictMode>
      <View style={styles.container}>
        <Text onPress={() => setChecked((prevChecked) => !prevChecked)}>
          Open up App.tsx to start working on your app!
        </Text>
        <View style={styles.boxGrid}>
          <Collapse in={checked}>
            <Animated.View style={styles.box} />
          </Collapse>
          <Collapse in={checked} collapsedSize={40}>
            <Animated.View style={styles.box} />
          </Collapse>
          <Grow in={checked}>
            <Animated.View style={styles.box} />
          </Grow>
          <Fade in={checked}>
            <Animated.View style={styles.box} />
          </Fade>
          <Zoom in={checked}>
            <Animated.View style={styles.box} />
          </Zoom>
          <Slide in={checked}>
            <Animated.View style={styles.box} />
          </Slide>
        </View>
        <StatusBar style="auto" />
      </View>
    </StrictMode>
  );
}
