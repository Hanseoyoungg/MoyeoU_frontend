import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import useOutSideClick from "../../hooks/useOutSideClick";
import ModalContainer from "./ModalContainer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import jsonData from "../../data.json";
import axios from "axios";
import Attend from "../Notification/Attend";
import Comment from "../Notification/Comment";
import Reject from "../Notification/Reject";
import Cancel from "../Notification/Cancel";
import End from "../Notification/End";
import Complete from "../Notification/Complete";
import Accept from "../Notification/Accept";

function Modal({ onClose }) {
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const [data, setData] = useState(""); //불러온 알림 내용 저장
  const getNotification = () => {
    //알림내용 불러오기
    axios
      .get("http://52.79.241.162:8080/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClose = () => {
    onClose?.();
  };
  const onClick = () => {
    //타입 비교 후 컴포넌트 할당
    //밑에 api는 각각의 컴포넌트 안에서 요청하기
    //
    //${postId} 같은 것들은 response.data 안의 객체별 내용들로 넣으면 됨
    //
    //수락 api
    // axios
    //   .post(
    //     `http://52.79.241.162:8080/posts/${postId}/participations/${participationId}/accept`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     console.log(response.data);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    //
    //거절 api
    // axios
    //   .post(
    //     `http://52.79.241.162:8080/posts/${postId}/participations/${participationId}/reject`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     console.log(response.data);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    //
    //navigate는 평가하라는 알림 컴포넌트에서만
    //postId는 response.data 안의 객체별 게시글 id
    //navigate(`/evaluateMember`, { state: postId });
  };
  useEffect(() => {
    getNotification();
    const $body = document.querySelector("body");
    const overflow = $body.style.overflow;
    $body.style.overflow = "hidden";
    return () => {
      $body.style.overflow = overflow;
    };
  }, []);

  useOutSideClick(modalRef, handleClose);

  return (
    <ModalContainer>
      <ModalWrap ref={modalRef}>
        <CloseButton>
          <p className="fa-solid fa-xmark" onClick={handleClose}>
            X
          </p>
        </CloseButton>
        {data === ""
          ? ""
          : data.map((item, idx) =>
              item.type === "ATTEND" ? (
                <Attend item={item} />
              ) : item.type === "CANCEL" ? (
                <Cancel item={item} />
              ) : item.type === "ACCEPT" ? (
                <Accept item={item} />
              ) : item.type === "REJECT" ? (
                <Reject item={item} />
              ) : item.type === "COMPLETE" ? (
                <Complete item={item} />
              ) : item.type === "END" ? (
                <End item={item} />
              ) : item.type === "COMMENT" ? (
                <Comment item={item} />
              ) : (
                <></>
              )
            )}
      </ModalWrap>
    </ModalContainer>
  );
}

const ModalWrap = styled.div`
  width: 25vw;
  min-height: 60vh;
  max-height: 60vh;
  overflow-y: scroll;
  background-color: #fff;
  position: absolute;
  top: 10vh;
  right: 18vw;
  box-shadow: 0 0.7rem 3rem gray;
`;

const CloseButton = styled.div`
  width: 100%;
  //height: auto;
  overflow: auto;
  p {
    cursor: pointer;
    :hover {
      color: black;
    }
    margin: 1vh 1vw;
    float: right;
    color: #5d5d5d;
    font-size: 2rem;
  }
`;

export default Modal;
