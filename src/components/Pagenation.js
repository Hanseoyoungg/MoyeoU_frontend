import styled from "styled-components";
import { useState } from "react";

function Pagenation({ totalPosts, limit, page, setPage }) {
  const numPages = Math.ceil(totalPosts / limit);
  const [currPage, setCurrPage] = useState(page);
  let firstNum = currPage - (currPage % 5) + 1;
  let lastNum = currPage - (currPage % 5) + 5;

  return (
    <PageSection>
      <ButtonWrap>
        <Button
          onClick={() => {
            setPage(page - 1);
            setCurrPage(page - 2);
          }}
          disabled={page === 1}
        >
          &lt;
        </Button>
        <Button
          onClick={() => {
            setPage(firstNum);
          }}
          aria-current={page === firstNum ? "page" : null}
          style={{ backgroundColor: page === firstNum ? "#deeaf6" : "white" }}
        >
          {firstNum}
        </Button>
        {Array(4)
          .fill()
          .map((_, i) => {
            if (i <= 2) {
              return (
                <Button
                  border="true"
                  key={i + 1}
                  onClick={() => {
                    setPage(firstNum + 1 + i);
                  }}
                  aria-current={page === firstNum + 1 + i ? "page" : null}
                  style={{
                    backgroundColor: (page % 5) - 2 === i ? "#deeaf6" : "white",
                  }}
                >
                  {firstNum + 1 + i}
                </Button>
              );
            } else if (i >= 3) {
              return (
                <Button
                  border="true"
                  key={i + 1}
                  onClick={() => setPage(lastNum)}
                  aria-current={page === lastNum ? "page" : null}
                  style={{
                    backgroundColor: (page % 5) + 3 === i ? "#deeaf6" : "white",
                  }}
                >
                  {lastNum}
                </Button>
              );
            }
          })}
        <Button
          onClick={() => {
            setPage(page + 1);
            setCurrPage(page);
          }}
          disabled={page === numPages}
        >
          &gt;
        </Button>
      </ButtonWrap>
    </PageSection>
  );
}

const PageSection = styled.div`
  height: 10vh;
  text-align: center;
  margin-top: 7vh;
`;

const ButtonWrap = styled.div``;

const Button = styled.button`
  border: 2px solid #385493;
  border-radius: 0.7rem;
  background-color: white;
  font-size: 2rem;
  margin: 0 0.3vw;
  padding: 0.8vh 0.8vw;
  :hover {
    background-color: #deeaf6;
  }
`;

export default Pagenation;
