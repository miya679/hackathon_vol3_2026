import { useCallback, useEffect, useState } from "react";
import ProgressForm from "../components/ProgressForm";
import { fetchMaterials } from "../services/materialService";
import { createProgressRecord } from "../services/progressService";

function todayString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function ProgressRecordPage() {
  const [materials, setMaterials] = useState([]);
  const [materialsLoading, setMaterialsLoading] = useState(true);
  const [materialsError, setMaterialsError] = useState(null);

  const [materialId, setMaterialId] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [note, setNote] = useState("");
  const [recordedAt, setRecordedAt] = useState(todayString());

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const loadMaterials = useCallback(async () => {
    setMaterialsLoading(true);
    setMaterialsError(null);
    try {
      const list = await fetchMaterials();
      setMaterials(list);
    } catch (err) {
      setMaterialsError(
        err instanceof Error ? err.message : "教材の取得に失敗しました"
      );
    } finally {
      setMaterialsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    const selected = materials.find((m) => m.id === materialId);
    if (!selected) {
      setSubmitError("教材を選択してください");
      return;
    }

    setSubmitting(true);
    try {
      await createProgressRecord({
        materialId: selected.id,
        materialTitle: selected.title,
        progressPercent,
        note,
        recordedAt,
      });
      setSubmitSuccess(true);
      setProgressPercent(0);
      setNote("");
      setRecordedAt(todayString());
      setMaterialId("");
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
          学習した教材の進捗を記録します。進捗表示画面で一覧・グラフとして確認できます。
        </p>
      </header>

      {materialsError && (
        <div className="alert alert--error" role="alert">
          {materialsError}
          <button
            type="button"
            className="btn btn--text"
            onClick={loadMaterials}
          >
            再読み込み
          </button>
        </div>
      )}

      <section className="card">
        <ProgressForm
          materials={materials}
          materialsLoading={materialsLoading}
          materialId={materialId}
          onMaterialChange={setMaterialId}
          progressPercent={progressPercent}
          onProgressChange={setProgressPercent}
          note={note}
          onNoteChange={setNote}
          recordedAt={recordedAt}
          onRecordedAtChange={setRecordedAt}
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
