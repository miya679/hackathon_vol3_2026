import React, { useState } from "react";
import styled from "styled-components";

function ProgressDisplay() {
  const [value, setValue] = useState(50);

  return (
    <Wrapper>
      <Header>
        <HeaderLeft>
          <IconBox>📚</IconBox>
          <Title>学習トラッカー</Title>
        </HeaderLeft>
        <AddButton>教材を追加</AddButton>
      </Header>
      <h2>Progress</h2>
      <p>This is a simple progress display component.</p>
      <ProgressContainer value={value} />
    </Wrapper>
  );
}

export default ProgressDisplay;

const ProgressContainer = ({ value }) => {
  return (
    <ProgressGrid>
      <ProgressCard>
        <h3>Card 1</h3>
        <p>This is the first progress card.</p>
        <ProgressBarContainer>
          <ProgressBarFill
            style={{
              width: `${value}%`,
              height: "100%",
              backgroundColor: "skyblue",
            }}
          />
        </ProgressBarContainer>
      </ProgressCard>
      <ProgressCard>
        <h3>Card 2</h3>
        <p>This is the second progress card.</p>
        <ProgressBarContainer>
          <ProgressBarFill
            style={{
              width: `${value}%`,
              height: "100%",
              backgroundColor: "skyblue",
            }}
          />
        </ProgressBarContainer>
      </ProgressCard>
      <ProgressCard>
        <h3>Card 3</h3>
        <p>This is the third progress card.</p>
        <ProgressBarContainer>
          <ProgressBarFill
            style={{
              width: `${value}%`,
              height: "100%",
              backgroundColor: "skyblue",
            }}
          />
        </ProgressBarContainer>
      </ProgressCard>
    </ProgressGrid>
  );
};

const Wrapper = styled.div`
  min-height: 100vh;
  margin: 0;
`;

const Header = styled.header`
  background-color: #7de2f0;
  padding: 1rem;
  margin: 0;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 16px;
  background-color: black;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.p`
  margin: 0;
  font-weight: bold;
`;

const AddButton = styled.button`
  background-color: black;
  border: none;
  color: white;
  border-radius: 16px;
  padding: 0.5rem 1rem;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const ProgressBarContainer = styled.div`
  width: 100px;
  height: 20px;
  background-color: #ddd;
  border-radius: 10px;
  margin-top: 1rem;
  overflow: hidden;
`;

const ProgressBarFill = styled.div``;

const ProgressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
`;

const ProgressCard = styled.div`
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
