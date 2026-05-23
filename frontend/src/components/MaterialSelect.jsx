function MaterialSelect({
  materials,
  value,
  onChange,
  disabled,
  loading,
}) {
  if (loading) {
    return (
      <select className="form-select" disabled>
        <option>教材を読み込み中...</option>
      </select>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="form-hint form-hint--warning">
        登録された教材がありません。教材登録画面で教材を追加してください。
      </div>
    );
  }

  return (
    <select
      id="material"
      className="form-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      required
    >
      <option value="">教材を選択してください</option>
      {materials.map((material) => (
        <option key={material.id} value={material.id}>
          {material.title}
        </option>
      ))}
    </select>
  );
}

export default MaterialSelect;
