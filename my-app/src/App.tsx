import React, { useState } from "react";

import "./App.css";
import axios from "axios";
import { Input, Button } from "antd";
import "antd/dist/antd.css";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBPIkNfyH9jMUrH5PiSZ4cbl8-n7rl9hk",
  authDomain: "fir-ok-a468d.firebaseapp.com",
  databaseURL: "https://fir-ok-a468d.firebaseio.com",
  projectId: "fir-ok-a468d",
  storageBucket: "fir-ok-a468d.appspot.com",
  messagingSenderId: "171026087399",
  appId: "1:171026087399:web:8b818c47888d1f4f69d142",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
function App() {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
    setLoading(true);
    const data = await axios.post("http://localhost:3001/swap", {
      data: {
        targetPrice: value,
      },
    });
    console.log("data", data);
    setLoading(false);
  };
  return (
    <div className="App">
      <Input
        value={value}
        onChange={(e) => {
          setValue(Number(e.target.value));
        }}
        placeholder="Target Price"
        type="number"
      />
      <Button loading={loading} onClick={onSubmit}>
        Swap{" "}
      </Button>
    </div>
  );
}

export default App;
