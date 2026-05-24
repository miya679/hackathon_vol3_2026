import ProgressDisplay from "./progress_display";

// firebaseにデータ送信できるかのテスト用画面です
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const apiUrl = process.env.REACT_APP_API_URL ?? "http://localhost:5000";

  const [name, setName] = useState("");

  const addUser = async () => {
    try {
      await addDoc(collection(db, "users"), {
        name: name,
        createdAt: new Date(),
      });

      alert("追加完了");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ProgressDisplay />;
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>React + Flask + Firebase</h1>

      <p>API: {apiUrl}</p>

      <hr />

      <h2>Firestore Test</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="名前"
      />

      <button onClick={addUser}>
        Firestoreに追加
      </button>
    </main>
  );
}

export default App;