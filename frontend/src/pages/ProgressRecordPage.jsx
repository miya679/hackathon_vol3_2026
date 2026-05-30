import { useCallback, useEffect, useState } from "react";
import ProgressForm from "../components/ProgressForm";
import { createProgress } from "../services/progressService";
import { fetchTexts } from "../services/textService";
import {
  parseTextRange,
  validateProgressPage,
} from "../utils/textRange";

function ProgressRecordPage() {
  const [texts, setTexts] = useState([]);
  const [textsLoading, setTextsLoading] = useState(true);
  const [textsError, setTextsError] = useState(null);

  const [textId, setTextId] = useState("");
  const [progressPage, setProgressPage] = useState(1);
  const [pageError, setPageError] = useState(null);

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
      setPageError(null);
      return;
    }
    const range = parseTextRange(selected.text_range);
    setPageError(validateProgressPage(progressPage, range));
  }, [textId, progressPage, texts]);

  const handleTextChange = (id) => {
    setTextId(id);
    const selected = texts.find((t) => t.id === id);
    const range = selected ? parseTextRange(selected.text_range) : null;
    setProgressPage(range?.start ?? 1);
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

    const range = parseTextRange(selected.text_range);
    const validation = validateProgressPage(progressPage, range);
    if (validation) {
      setPageError(validation);
      return;
    }

    setSubmitting(true);
    try {
      await createProgress({
        textId: selected.id,
        progressPage,
      });
      setSubmitSuccess(true);
      setTextId("");
      setProgressPage(1);
      setPageError(null);
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
          学習中のページ番号を記録します。
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
          progressPage={progressPage}
          onProgressPageChange={setProgressPage}
          pageError={pageError}
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
