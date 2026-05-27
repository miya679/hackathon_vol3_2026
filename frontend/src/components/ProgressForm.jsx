import TextSelect from "./TextSelect";
import { parseTextRange, progressPercent } from "../utils/textRange";

function ProgressForm({
  texts,
  textsLoading,
  textId,
  onTextChange,
  progressPage,
  onProgressPageChange,
  pageError,
  onSubmit,
  submitting,
  submitError,
  submitSuccess,
}) {
  const selectedText = texts.find((t) => t.id === textId);
  const range = selectedText
    ? parseTextRange(selectedText.text_range)
    : null;
  const percent = range ? progressPercent(progressPage, range) : null;

  const sliderMin = range?.start ?? 1;
  const sliderMax = range?.end ?? Math.max(100, progressPage);
  const sliderDisabled =
    submitting || texts.length === 0 || !textId;

  const canSubmit =
    !submitting &&
    texts.length > 0 &&
    textId &&
    progressPage >= 1 &&
    !pageError;

  return (
    <form className="progress-form" onSubmit={onSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="text" className="form-label">
          教材 <span className="required">*</span>
        </label>
        <TextSelect
          texts={texts}
          value={textId}
          onChange={onTextChange}
          disabled={submitting}
          loading={textsLoading}
        />
        {selectedText && (
          <div className="form-hint">
            {selectedText.text_type && (
              <span>種別: {selectedText.text_type} / </span>
            )}
            {selectedText.text_range ? (
              <span>ページ範囲: {selectedText.text_range}</span>
            ) : (
              <span>ページ範囲が未設定です（text_range）</span>
            )}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="progressPage" className="form-label">
          現在のページ <span className="required">*</span>
          <span className="progress-value">
            {progressPage} ページ
            {percent !== null && `（${percent}%）`}
          </span>
        </label>
        <input
          id="progressPage"
          type="range"
          className="form-range"
          min={sliderMin}
          max={sliderMax}
          step={1}
          value={Math.min(Math.max(progressPage, sliderMin), sliderMax)}
          onChange={(e) => onProgressPageChange(Number(e.target.value))}
          disabled={sliderDisabled}
          required
        />
        <div className="progress-labels">
          <span>{sliderMin} ページ</span>
          {range && <span>中間</span>}
          <span>{sliderMax} ページ</span>
        </div>
        {pageError && (
          <p className="form-hint form-hint--error">{pageError}</p>
        )}
        {!pageError && !range && textId && (
          <p className="form-hint">
            text_range（例: 1-120）を設定すると、教材のページ範囲に合わせてスライダーが固定されます
          </p>
        )}
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
