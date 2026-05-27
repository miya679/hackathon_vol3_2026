import styled from "styled-components";

export const ProgressCard = ({ value, textName, textTag }) => {
  return (
    <SContainer>
      <STextName>{textName}</STextName>
      <TextTag tagName={textTag} />
      <SProgressBarContainer>
        <SProgressBarFill
          style={{
            width: `${value}%`,
            height: "100%",
            backgroundColor: "var(--color-primary)",
          }}
        />
      </SProgressBarContainer>
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
