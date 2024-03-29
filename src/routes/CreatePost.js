import styled from "styled-components";
import Header from "../components/Header";
import tagJson from "../tag.json";
import TextEditor from "../components/TextEditor";
import { useEffect, useState } from "react";
import React from "react";
import { IoIosAddCircle, IoIosCloseCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";

function CreatePost(props) {
  const [selectCategory, setselectCategory] = useState("어학");
  const [selectTag, setselectTag] = useState("토익");
  const [itemsValue, setItemsValue] = useState("");

  const [title, setTitle] = useState("");
  const [headCount, setHeadCount] = useState("");
  const [operationWay, setOperationWay] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [isTagVisible, setIsTagVisible] = useState([]);
  const [content, setContent] = useState("");
  const [items, setItems] = useState([]); //신청폼

  const navigate = useNavigate();

  const onSubmit = () => {
    // if (!items) {
    //   alert("신청폼을 하나 이상 작성해 주세요.");
    //   return;
    // }
    axios
      .post(
        "http://52.79.241.162:8080/posts",
        {
          title: title,
          headCount: Number(headCount),
          operationWay: operationWay,
          expectedDate: expectedDate,
          estimatedDuration: estimatedDuration,
          hashtags: isTagVisible,
          content: content,
          items: items,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "게시글 작성이 완료되었습니다.",
          confirmButtonText: "확인",
          confirmButtonColor: "#385493",
        }).then(() => {
          const words = response.headers.location.split("/");
          const postId = Number(words[words.length - 1]);
          navigate(`/postView/${postId}`, {
            state: postId,
          });
        });
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.message === "요청 파라미터가 잘못되었습니다.") {
          if (Number(headCount) < 2) {
            Swal.fire({
              icon: "warning",
              text: "모집 인원을 2명 이상으로 설정해주세요.",
              showConfirmButton: false,
              timer: 1200,
            });
            return;
          }
          Swal.fire({
            icon: "warning",
            text: "모든 항목을 채워주세요.",
            showConfirmButton: false,
            timer: 1200,
          });
        }
      });
  };

  const goMain = () => {
    Swal.fire({
      title: "게시글 작성이 취소되었습니다.",
      icon: "info",
      confirmButtonText: "확인",
      confirmButtonColor: "#385493",
    }).then(() => {
      navigate(`/`);
    });
  };
  const onCreateForm = () => {
    if (items.includes(itemsValue)) {
      Swal.fire({
        icon: "warning",
        text: "이미 존재하는 신청 양식입니다.",
        showConfirmButton: false,
        timer: 1200,
      });
      return;
    }
    if (itemsValue !== "") {
      setItems((v) => [...v, itemsValue]);
      setItemsValue("");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeCategory = (event) => {
    let categoryValue = event.target.value;
    setselectCategory(categoryValue);
    if (categoryValue === "어학") {
      setselectTag(tagJson.tag1[0][0]);
    } else if (categoryValue === "프로그래밍") {
      setselectTag(tagJson.tag2[0][0]);
    } else if (categoryValue === "팀프로젝트") {
      setselectTag(tagJson.tag3[0][0]);
    } else if (categoryValue === "자격증") {
      setselectTag(tagJson.tag4[0][0]);
    } else if (categoryValue === "취미/교양") {
      setselectTag(tagJson.tag5[0][0]);
    } else if (categoryValue === "고시/공무원") {
      setselectTag(tagJson.tag6[0][0]);
    } else {
      setselectTag("기타");
    }
  };

  const changeTag = (event) => {
    setselectTag(event.target.value);
  };
  const addTagBtn = () => {
    if (selectTag === "") {
      Swal.fire({
        icon: "warning",
        text: "해시태그를 선택해주세요.",
        showConfirmButton: false,
        timer: 1200,
      });
      return;
    }
    if (isTagVisible.includes(selectTag)) {
      Swal.fire({
        icon: "warning",
        text: "이미 선택한 해시태그입니다.",
        showConfirmButton: false,
        timer: 1200,
      });
      return;
    }
    setIsTagVisible((prevList) => [...prevList, selectTag]);
  };
  const removeTag = (event) => {
    const removeId = event.target.parentNode.id;
    setIsTagVisible(isTagVisible.filter((value, index) => value !== removeId));
    //event.target.parentNode.style.display = "inline-block";
  };

  const removeItems = (e) => {
    //setItems에서 제거
    const filtered = items.filter(
      (element) => element !== e.target.previousSibling.innerText
    );
    setItems(filtered);
  };
  return (
    <div>
      <Header
        isAlertCountChange={props.isAlertCountChange}
        setIsAlertCountChange={props.setIsAlertCountChange}
        alertCount={props.alertCount}
        setAlertCount={props.setAlertCount}
      />
      <CreateDiv>
        <Div>
          <TitleUl>
            <TitleInput
              placeholder="제목을 입력해주세요."
              required
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </TitleUl>
          <Ul>
            <Li>
              <P>모집 인원</P>
              <TextInput
                type="number"
                required
                onChange={(e) => {
                  setHeadCount(e.target.value);
                }}
              />
            </Li>
            <Li>
              <P>운영 방식</P>
              <TextInput
                required
                onChange={(e) => {
                  setOperationWay(e.target.value);
                }}
              />
            </Li>
          </Ul>
          <Ul>
            <Li>
              <P>시작 예정일</P>
              <TextInput
                type="date"
                required
                onChange={(e) => {
                  setExpectedDate(e.target.value);
                }}
              />
            </Li>
            <Li>
              <P>예상 기간</P>
              <TextInput
                required
                onChange={(e) => {
                  setEstimatedDuration(e.target.value);
                }}
              />
            </Li>
          </Ul>
          <Ul>
            <Li>
              <P>카테고리</P>
              <TagSelect name="tag" id="tag" onChange={changeCategory}>
                {tagJson.category.map((item) => (
                  <option value={item[0]} key={item[1]}>
                    {item[0]}
                  </option>
                ))}
              </TagSelect>
            </Li>
            <Li>
              <P>해시태그</P>
              <TagSelect name="secondTag" id="secondTag" onChange={changeTag}>
                {selectCategory === "프로그래밍" ? (
                  tagJson.tag2.map((item) => (
                    <option value={item[0]} key={item[1]}>
                      {item[0]}
                    </option>
                  ))
                ) : selectCategory === "팀프로젝트" ? (
                  tagJson.tag3.map((item) => (
                    <option value={item[0]} key={item[1]}>
                      {item[0]}
                    </option>
                  ))
                ) : selectCategory === "자격증" ? (
                  tagJson.tag4.map((item) => (
                    <option value={item[0]} key={item[1]}>
                      {item[0]}
                    </option>
                  ))
                ) : selectCategory === "취미/교양" ? (
                  tagJson.tag5.map((item) => (
                    <option value={item[0]} key={item[1]}>
                      {item[0]}
                    </option>
                  ))
                ) : selectCategory === "고시/공무원" ? (
                  tagJson.tag6.map((item) => (
                    <option value={item[0]} key={item[1]}>
                      {item[0]}
                    </option>
                  ))
                ) : selectCategory === "기타" ? (
                  <option>기타</option>
                ) : (
                  tagJson.tag1.map((item) => (
                    <option value={item[0]} key={item[1]}>
                      {item[0]}
                    </option>
                  ))
                )}
              </TagSelect>
              <button className="addBtn" onClick={addTagBtn}>
                추가
              </button>
            </Li>
          </Ul>
          <Ul>
            <Li></Li>
            <Li>
              {Object.values(isTagVisible).map((item) => (
                <TagEdit id={item}>
                  {item} &nbsp;<span onClick={removeTag}>X</span>
                </TagEdit>
              ))}
            </Li>
          </Ul>
        </Div>
        <Div>
          <Ul>
            <li>
              <P>스터디에 대해 설명해주세요.</P>
              <TextEditor required content={content} setContent={setContent} />
            </li>
          </Ul>
        </Div>
        <Div>
          <Ul>
            <li>
              <FormMaker>
                신청 양식을 만들어주세요.
                <IoIosAddCircle
                  size="30"
                  className="addIcon"
                  onClick={onCreateForm}
                />
              </FormMaker>
              <TextInput
                value={itemsValue}
                onChange={(e) => {
                  setItemsValue(e.target.value);
                }}
              />
              {items.map((v) => (
                <ItemDiv>
                  <p key={v}>{v}</p>
                  <span onClick={removeItems}>
                    <IoIosCloseCircleOutline size="25" className="deleteIcon" />
                  </span>
                </ItemDiv>
              ))}
            </li>
          </Ul>
        </Div>
        <Div>
          <Btn>
            <button type="button" onClick={goMain}>
              취소하기
            </button>
            <button onClick={onSubmit}>등록하기</button>
          </Btn>
        </Div>
      </CreateDiv>
    </div>
  );
}

const Li = styled.li`
  float: left;
  width: 50%;
  .addBtn {
    margin: 0 0.5vw;
    width: 3vw;
    height: 4.5vh;
    border: 1px solid #385493;
    background-color: #385493;
    color: white;
    font-weight: bold;
    border-radius: 5px;
  }
`;

const TitleUl = styled.ul`
  display: flex;
  max-width: 100%;
  margin-bottom: 6vh;
`;

const Ul = styled.ul`
  display: flex;
  max-width: 100%;
  margin-bottom: 3vh;
`;

const TitleInput = styled.input`
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 3px solid #0d47a1;
  width: 100%;
  height: 10vh;
  font-size: 3em;
  font-weight: bold;
  text-indent: 0.5vw;
  :focus {
    outline: none;
  }
  ::placeholder {
    color: lightgray;
  }
`;

const TagSelect = styled.select`
  box-sizing: content-box;
  border: 2px solid lightgray;
  font-size: 2vh;
  border-radius: 5px;
  width: 20vw;
  height: 2vw;
  padding: 1px 2px;
  text-indent: 0.5vw;
  :focus {
    border: 2px solid black;
  }
`;

const TagEdit = styled.button`
  margin: 0.3vh 0.3vw;
  border-radius: 5px;
  //pointer-events: none;
  background-color: #dcdcdc;
  display: inline;
  padding: 0.5vh 0.5vw;
  font-size: 1.5rem;
  :hover {
    cursor: default;
  }
  span {
    color: gray;
    :hover {
      cursor: pointer;
      color: black;
    }
  }
`;

const P = styled.p`
  font-size: 2.5vh;
  font-weight: bold;
`;

const FormMaker = styled.p`
  font-size: 2.5vh;
  font-weight: bold;
  display: flex;
  align-items: center;
  .addIcon {
    margin-left: 2vw;
    color: lightgray;
    :hover {
      cursor: pointer;
    }
  }
`;

const TextInput = styled.input`
  border: 2px solid lightgray;
  font-size: 2vh;
  border-radius: 5px;
  width: 20vw;
  height: 2vw;
  padding: 1px 2px;
  text-indent: 0.5vw;
`;

const CreateDiv = styled.div`
  padding: 5vh 10vw;
  height: auto;
  min-height: 70vh;
  overflow: auto;
  max-width: 100%;
`;

const EditerDiv = styled.div`
  max-width: 100%;
  height: auto;
  margin: 5vh 10vw 0 10vw;
`;

const Div = styled.div`
  max-width: 100%;
  height: auto;
  margin: 0 10vw;
`;

const Btn = styled.div`
  float: right;
  button {
    margin: 0.5em 0.5em;
    width: 8em;
    height: 3em;
    border: 1px solid #385493;
    background-color: #385493;
    color: white;
    font-weight: bold;
    border-radius: 5px;
    :hover {
      cursor: pointer;
    }
  }
`;

const ItemDiv = styled.div`
  margin-top: 1.5vh;
  padding-left: 1.5vw;
  height: 5em;
  background-color: #ecf1f3;
  border-radius: 5px;
  font-weight: bold;
  display: flex;
  position: relative;
  align-items: center;
  p {
    display: inline;
    font-size: 1.85vh;
    margin: auto;
    color: gray;
  }
  .deleteIcon {
    float: right;
    margin: 0 1vh 0 0.2vh;
    color: gray;
    pointer-events: none;
  }
  }
`;

export default CreatePost;
