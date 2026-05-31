function TextSelect({ texts, value, onChange, disabled, loading }) {
  if (loading) {
    return (
      <select className="form-select" disabled>
        <option>教材を読み込み中...</option>
      </select>
    );
  }

  if (texts.length === 0) {
    return (
      <div className="form-hint form-hint--warning">
        登録された教材（texts）がありません。教材登録画面で追加するか、Firestore
        Console から texts コレクションにデータを追加してください。
      </div>
    );
  }

  return (
    <select
      id="text"
      className="form-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      required
    >
      <option value="">教材を選択してください</option>
      {texts.map((text) => (
        <option key={text.id} value={text.id}>
          {text.text_name}
        </option>
      ))}
    </select>
  );
}

export default TextSelect;
