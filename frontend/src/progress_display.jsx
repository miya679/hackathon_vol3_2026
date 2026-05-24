function ProgressDisplay() {
  return (
    <div>
      <header
        style={{
          backgroundColor: "#7de2f0",
          padding: "1rem",
          margin: "0",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              border: "none",
              borderRadius: "16px",
              width: "40px",
              height: "40px",
              backgroundColor: "black",
              color: "white",
            }}
          >
            <p style={{ textAlign: "center", lineHeight: "40px", margin: 0 }}>
              📚
            </p>
          </div>
          <div>
            <p>学習トラッカー</p>
          </div>
        </div>
        <div>
          <button
            style={{
              backgroundColor: "black",
              border: "none",
              color: "white",
              borderRadius: "16px",
              padding: "0.5rem 1rem",
              /*
              このスタイリングでhoverは効かないらしい。styled-componentsに移行したい
              ":hover": {
                opacity: 0.8,
              },
              */
            }}
          >
            <p>教材を追加</p>
          </button>
        </div>
      </header>
      <h2>Progress</h2>
      <p>This is a simple progress display component.</p>
    </div>
  );
}

export default ProgressDisplay;
