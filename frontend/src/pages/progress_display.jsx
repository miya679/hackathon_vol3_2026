import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Header } from "../components/Header";
import { ProgressCard } from "../components/ProgressCard";
import { fetchTexts } from "../services/textService";

function ProgressDisplay() {
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
    <Wrapper>
      <Header />

      {isLoading ? (
        <StatusMessage>Loading texts...</StatusMessage>
      ) : error ? (
        <StatusMessage>テキストの読み込みに失敗しました。</StatusMessage>
      ) : list.length === 0 ? (
        <StatusMessage>読み込めるテキストがありません。</StatusMessage>
      ) : (
        <ProgressContainer>
          {list.map((item) => (
            <ProgressCard
              key={item.id}
              value={Number(item.text_range) || 0}
              textName={item.text_name}
              textTag={item.text_type}
            />
          ))}
        </ProgressContainer>
      )}
    </Wrapper>
  );
}

export default ProgressDisplay;

const ProgressContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 500px));
  gap: 1rem;
  padding: 1rem;
  background-color: var(--color-bg);
`;

const Wrapper = styled.div`
  min-height: 100vh;
  margin: 0;
`;

const StatusMessage = styled.div`
  padding: 1rem;
  color: var(--color-text);
`;
