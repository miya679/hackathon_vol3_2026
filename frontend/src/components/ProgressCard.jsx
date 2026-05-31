import { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchTexts } from "../services/textService";

export const ProgressCard = ({ value, textName, textTag }) => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadTexts = async () => {
      try {
        const data = await fetchTexts();
        if (isMounted) {
          setList(data);
        }
      } catch (fetchError) {
        console.error(fetchError);
        if (isMounted) {
          setError(fetchError);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTexts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SContainer>
      <STextName>{textName}</STextName>
      <TextTag tagName={textTag} />
      <SProgressBar value={value}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 0.5rem",
            width: "100%",
          }}
        >
          <span style={{ fontSize: "0.75rem", color: "var(--color-text)" }}>
            進捗
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--color-text)" }}>
            {value}%
          </span>
        </div>
        <SProgressBarContainer>
          <SProgressBarFill
            style={{
              width: `${value}%`,
            }}
          />
        </SProgressBarContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 0.5rem",
            width: "100%",
          }}
        >
          <span style={{ fontSize: "0.75rem", color: "var(--color-text)" }}>
            0%
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--color-text)" }}>
            100%
          </span>
        </div>
      </SProgressBar>

      <div>
        {isLoading ? (
          <div>Loading texts...</div>
        ) : error ? (
          <div>テキストの読み込みに失敗しました。</div>
        ) : (
          <pre>{JSON.stringify(list, null, 2)}</pre>
        )}
      </div>
    </SContainer>
  );
};

const SContainer = styled.div`
  background-color: var(--color-surface);
  padding: 1rem;
  border-radius: 16px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
`;

const STextName = styled.h2`
  margin: 0;
  font-weight: bold;
  font-size: 1.2rem;
`;

const SProgressBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  width: 100%;
`;

const SProgressBarContainer = styled.div`
  width: 100%;
  height: 10px;
  background-color: var(--color-bg);
  border-radius: 10px;
  margin-top: 1rem;
  overflow: hidden;
`;

const SProgressBarFill = styled.div`
  height: 100%;
  background-color: var(--color-primary);
`;

const TextTag = ({ tagName }) => {
  return (
    <div
      style={{
        backgroundColor: "var(--color-text-tag)",
        color: "var(--color-text)",
        padding: "0.25rem 1rem",
        borderRadius: "16px",
        fontSize: "0.875rem",
        fontWeight: "bold",
        border: "1px solid #a2def8",
      }}
    >
      {tagName}
    </div>
  );
};
