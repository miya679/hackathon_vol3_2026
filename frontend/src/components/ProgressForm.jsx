import TextSelect from "./TextSelect";
import { getTextPageBounds } from "../utils/pageStudy";
import { progressPercent } from "../utils/textRange";

function ProgressForm({
  texts,
  textsLoading,
  textId,
  onTextChange,
  progressStartPage,
  progressEndPage,
  onProgressStartPageChange,
  onProgressEndPageChange,
  labelsInput,
  onLabelsChange,
  rangeError,
  onSubmit,
  submitting,
  submitError,
  submitSuccess,
}) {
  const selectedText = texts.find((t) => t.id === textId);
  const range = selectedText ? getTextPageBounds(selectedText) : null;
  const displayEnd = Math.max(progressStartPage, progressEndPage);
  const percent = range ? progressPercent(displayEnd, range) : null;

  const sliderMin = range?.start ?? 1;
  const sliderMax =
    range?.end ?? Math.max(100, displayEnd, progressStartPage);
  const sliderDisabled = submitting || texts.length === 0 || !textId;

  const canSubmit =
    !submitting &&
    texts.length > 0 &&
    textId &&
    !rangeError;

  const rangeHint = range
    ? `教材ページ: ${range.start}〜${range.end}`
    : "開始・終了で学習範囲を記録します。";

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
            <span>{rangeHint}</span>
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="progressStartPage" className="form-label">
          学習範囲（開始ページ） <span className="required">*</span>
          <span className="progress-value">{progressStartPage} ページ</span>
        </label>
        <input
          id="progressStartPage"
          type="range"
          className="form-range"
          min={sliderMin}
          max={sliderMax}
          step={1}
          value={Math.min(
            Math.max(progressStartPage, sliderMin),
            sliderMax
          )}
          onChange={(e) =>
            onProgressStartPageChange(Number(e.target.value))
          }
          disabled={sliderDisabled}
          required
        />
        <div className="progress-labels">
          <span>{sliderMin}</span>
          {range && <span>〜</span>}
          <span>{sliderMax}</span>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="progressEndPage" className="form-label">
          学習範囲（終了ページ） <span className="required">*</span>
          <span className="progress-value">
            {progressEndPage} ページ
            {percent !== null && `（到達目安 ${percent}%）`}
          </span>
        </label>
        <input
          id="progressEndPage"
          type="range"
          className="form-range"
          min={sliderMin}
          max={sliderMax}
          step={1}
          value={Math.min(
            Math.max(progressEndPage, sliderMin),
            sliderMax
          )}
          onChange={(e) => onProgressEndPageChange(Number(e.target.value))}
          disabled={sliderDisabled}
          required
        />
      </div>

      {rangeError && (
        <p className="form-hint form-hint--error">{rangeError}</p>
      )}

      <div className="form-group">
        <label htmlFor="labels" className="form-label">
          ラベル（任意）
        </label>
        <input
          id="labels"
          type="text"
          className="form-input"
          value={labelsInput}
          onChange={(e) => onLabelsChange(e.target.value)}
          placeholder="例: 微分, 復習, 重要"
          disabled={submitting}
          autoComplete="off"
        />
        <p className="form-hint">
          カンマ・空白で区切り（最大20個）。# は省略可能です。
        </p>
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
