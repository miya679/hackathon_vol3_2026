import { useCallback, useEffect, useState } from "react";
import ProgressForm from "../components/ProgressForm";
import { createProgress } from "../services/progressService";
import { fetchTexts } from "../services/textService";
import {
  getTextPageBounds,
  parseLabelInput,
} from "../utils/pageStudy";
import { validatePageRange } from "../utils/textRange";

function ProgressRecordPage() {
  const [texts, setTexts] = useState([]);
  const [textsLoading, setTextsLoading] = useState(true);
  const [textsError, setTextsError] = useState(null);

  const [textId, setTextId] = useState("");
  const [progressStartPage, setProgressStartPage] = useState(1);
  const [progressEndPage, setProgressEndPage] = useState(1);
  const [labelsInput, setLabelsInput] = useState("");
  const [rangeError, setRangeError] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const loadTexts = useCallback(async () => {
    setTextsLoading(true);
    setTextsError(null);
    try {
      const list = await fetchTexts();
      setTexts(list);
    } catch (err) {
      setTextsError(
        err instanceof Error ? err.message : "教材の取得に失敗しました"
      );
    } finally {
      setTextsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTexts();
  }, [loadTexts]);

  useEffect(() => {
    const selected = texts.find((t) => t.id === textId);
    if (!selected) {
      setRangeError(null);
      return;
    }
    const bounds = getTextPageBounds(selected);
    setRangeError(
      validatePageRange(progressStartPage, progressEndPage, bounds)
    );
  }, [textId, progressStartPage, progressEndPage, texts]);

  const handleTextChange = (id) => {
    setTextId(id);
    const selected = texts.find((t) => t.id === id);
    const bounds = selected ? getTextPageBounds(selected) : null;
    const start = bounds?.start ?? 1;
    setProgressStartPage(start);
    setProgressEndPage(start);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    const selected = texts.find((t) => t.id === textId);
    if (!selected) {
      setSubmitError("教材を選択してください");
      return;
    }

    const bounds = getTextPageBounds(selected);
    const validation = validatePageRange(
      progressStartPage,
      progressEndPage,
      bounds
    );
    if (validation) {
      setRangeError(validation);
      return;
    }

    const labels = parseLabelInput(labelsInput);

    setSubmitting(true);
    try {
      await createProgress({
        textId: selected.id,
        pageStart: progressStartPage,
        pageEnd: progressEndPage,
        labels,
      });
      setSubmitSuccess(true);
      setTextId("");
      setProgressStartPage(1);
      setProgressEndPage(1);
      setLabelsInput("");
      setRangeError(null);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "保存に失敗しました"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">進捗記録</h1>
        <p className="page-description">
          今日学習したページ範囲を記録します。
        </p>
      </header>

      {textsError && (
        <div className="alert alert--error" role="alert">
          {textsError}
          <button type="button" className="btn btn--text" onClick={loadTexts}>
            再読み込み
          </button>
        </div>
      )}

      <section className="card">
        <ProgressForm
          texts={texts}
          textsLoading={textsLoading}
          textId={textId}
          onTextChange={handleTextChange}
          progressStartPage={progressStartPage}
          progressEndPage={progressEndPage}
          onProgressStartPageChange={setProgressStartPage}
          onProgressEndPageChange={setProgressEndPage}
          labelsInput={labelsInput}
          onLabelsChange={setLabelsInput}
          rangeError={rangeError}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitError={submitError}
          submitSuccess={submitSuccess}
        />
      </section>
    </div>
  );
}

export default ProgressRecordPage;
