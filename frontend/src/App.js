import ProgressDisplay from "./progress_display";

function App() {
  const apiUrl = process.env.REACT_APP_API_URL ?? "http://localhost:5000";

  return <ProgressDisplay />;
}

export default App;
