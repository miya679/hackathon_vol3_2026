import MaterialSelect from "./MaterialSelect";

function ProgressForm({
  materials,
  materialsLoading,
  materialId,
  onMaterialChange,
  progressPercent,
  onProgressChange,
  note,
  onNoteChange,
  recordedAt,
  onRecordedAtChange,
  onSubmit,
  submitting,
  submitError,
  submitSuccess,
}) {
  const selectedMaterial = materials.find((m) => m.id === materialId);
  const canSubmit =
    !submitting &&
    materials.length > 0 &&
    materialId &&
    progressPercent >= 0 &&
    progressPercent <= 100;

  return (
    <form className="progress-form" onSubmit={onSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="material" className="form-label">
          教材 <span className="required">*</span>
        </label>
        <MaterialSelect
          materials={materials}
          value={materialId}
          onChange={onMaterialChange}
          disabled={submitting}
          loading={materialsLoading}
        />
        {selectedMaterial?.description && (
          <p className="form-hint">{selectedMaterial.description}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="progress" className="form-label">
          進捗 <span className="required">*</span>
          <span className="progress-value">{progressPercent}%</span>
        </label>
        <input
          id="progress"
          type="range"
          className="form-range"
          min="0"
          max="100"
          step="5"
          value={progressPercent}
          onChange={(e) => onProgressChange(Number(e.target.value))}
          disabled={submitting || materials.length === 0}
        />
        <div className="progress-labels">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="recordedAt" className="form-label">
          記録日 <span className="required">*</span>
        </label>
        <input
          id="recordedAt"
          type="date"
          className="form-input"
          value={recordedAt}
          onChange={(e) => onRecordedAtChange(e.target.value)}
          disabled={submitting || materials.length === 0}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="note" className="form-label">
          メモ
        </label>
        <textarea
          id="note"
          className="form-textarea"
          rows={4}
          placeholder="学習内容や気づきを記録できます（任意）"
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          disabled={submitting || materials.length === 0}
          maxLength={500}
        />
        <p className="form-hint">{note.length} / 500 文字</p>
      </div>

      {submitError && (
        <div className="alert alert--error" role="alert">
          {submitError}
        </div>
      )}

      {submitSuccess && (
        <div className="alert alert--success" role="status">
          進捗を保存しました。
        </div>
      )}

      <button
        type="submit"
        className="btn btn--primary"
        disabled={!canSubmit}
      >
        {submitting ? "保存中..." : "進捗を保存"}
      </button>
    </form>
  );
}

export default ProgressForm;
