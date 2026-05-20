function App() {
  const apiUrl = process.env.REACT_APP_API_URL ?? "http://localhost:5000";

  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>React + Flask + Firebase</h1>
      <p>API: {apiUrl}</p>
    </main>
  );
}

export default App;
