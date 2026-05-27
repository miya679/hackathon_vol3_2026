import React, { useState } from "react";
import styled from "styled-components";
import { Header } from "../components/Header";
import { ProgressCard } from "../components/ProgressCard";

function ProgressDisplay() {
  const [value, setValue] = useState(50);

  return (
    <Wrapper>
      <Header />
      <h2>Progress</h2>
      <p>This is a simple progress display component.</p>
      <ProgressContainer value={value} textName="Next Stage" textTag="教科書" />
    </Wrapper>
  );
}

export default ProgressDisplay;

const ProgressContainer = ({ value, textName, textTag }) => {
  return (
    <ProgressGrid>
      <ProgressCard value={value} textName={textName} textTag={textTag} />
    </ProgressGrid>
  );
};

const Wrapper = styled.div`
  min-height: 100vh;
  margin: 0;
`;

const ProgressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 300px));
  gap: 1rem;
  padding: 1rem;
  background-color: var(--color-bg);
`;
