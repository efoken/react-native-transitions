import { useState } from "react";
import { Fade, Slide, Zoom } from "react-native-transitions";
import "./App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <Slide in={count % 2 === 0}>
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </Slide>
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <Zoom in={count % 2 === 0}>
            <img src={reactLogo} className="logo react" alt="React logo" />
          </Zoom>
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button type="button" onClick={() => setCount((prevCount) => prevCount + 1)}>
          count is {count}
        </button>
        <Fade in={count % 2 === 0}>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </Fade>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
