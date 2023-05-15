import { useState } from "react";
import dummy from "../data.json";
import Post from "./Post";
import PostList from "./PostList";
import styled from "styled-components";

function PostMain() {
  const [post, setPost] = useState(dummy.board);

  return (
    <>
      <Div>
        <PostList />
        <PostDiv>
          {Object.values(post).map((posts) => (
            <Post {...posts} key={posts.id} />
          ))}
        </PostDiv>
      </Div>
    </>
  );
}

const Div = styled.div`
  //clear: both;
  padding: 3em;
  //justify-content: center;
  height: auto;
  //min-height: 80vh;
`;

const PostDiv = styled.div`
  /*clear: both;
  width: 100%;
  max-width: 1300px;
  min-height: 60rem;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;*/
  height: auto;
  min-height: 100vh;
`;

export default PostMain;