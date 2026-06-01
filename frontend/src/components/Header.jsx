import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <SHeader>
      <SHeaderLeft>
        <SIconBox>📚</SIconBox>
        <STitle>学習トラッカー</STitle>
      </SHeaderLeft>
      <SAddButton onClick={() => navigate("/text/register")}>教材を追加</SAddButton>
    </SHeader>
  );
};

const SHeader = styled.header`
  background-color: var(--color-surface);
  padding: 1rem;
  margin: 0;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SIconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 16px;
  background-color: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const STitle = styled.h1`
  margin: 0;
  font-weight: bold;
  color: var(--color-text);
`;

const SHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SAddButton = styled.button`
  background-color: var(--color-primary);
  border: none;
  color: var(--color-text);
  color: white;
  border-radius: 16px;
  padding: 0.5rem 1rem;
  cursor: pointer;

  &:hover {
    background-color: var(--color-primary-hover);
  }
`;
