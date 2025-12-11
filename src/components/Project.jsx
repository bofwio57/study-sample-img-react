import React, { useState, useEffect, useCallback } from "react";
import styled, { css } from "styled-components";
import { supabase } from "../lib/supabase";

const StyledProject = styled.section`
    padding-bottom: 15rem;

    .project_items {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 2rem;
    }

    .project_item {
        border-radius: 10px;
        overflow: hidden;
        background-color: #161616;
        border: 1px solid #ffffff1a;

        .img_area {
            overflow: hidden;
            width: 100%;
            position: relative;
            aspect-ratio: 800 / 600;
            cursor: pointer;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.5s ease;
                transform: scale(1.001);
            }
        }

        &:hover .img_area img {
            transform: scale(1.05);
        }

        .txt_area {
            .sub_tit {
                display: flex;
                gap: 0.25rem;
                align-items: center;
                padding: 0.75rem 0.75rem 1.5rem 0.75rem;
                transition: color 0.2s ease;
                color: #7c7c7c;
            }
        }

        &:hover .txt_area .sub_tit {
            color: #fff;
        }
    }

    .tag_list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.2rem;
        padding: 0 0.5rem 0.75rem;

        li {
            background-color: #232325;
            color: #aaa;
            padding: 0.25rem 0.625rem;
            border-radius: 1rem;
            font-size: 0.75rem;
            font-weight: 500;
            text-decoration: none;
            transition: background-color 0.2s ease;
        }
    }
`;

function Project({ ...props }) {
    const [projectItems, setProjectITems] = useState([]);

    // 데이터 조회 (READ)
    useEffect(() => {
        fetchProject();
    }, []);

    const fetchProject = async () => {
        try {
            let { data: project, error } = await supabase.from("project").select("*");

            if (error) {
                console.log(error);
                return;
            }

            //데이터가 있으면 데이터를 없으면 빈값[]을
            setProjectITems(project || []);
        } catch (error) {
            console.log(error);
        }
    };

    //데이터를 추가(CREATE)
    // const addProject = async (e) => {
    //     e.preventDefault();

    //     try {
    //         //이 부분은 supabase 홈페(api 탭)에 있음
    //         const { data } = await supabase
    //             .from("todos")
    //             .insert([{ text: inputValue }]) //추가
    //             .select(); //가져옴

    //         if (data && data.length > 0) {
    //             //데이터가 있을때
    //             setTodos([data[0], ...todos]); //셋 데이터 업데이트
    //         }
    //         setInputValue(""); //빈칸 만들기
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    // // callback 메서드 작성. callback 메서드는 부모의 공유 상태값을 변경하기 위해서 사용된다.
    // const callback = useCallback(
    //     (param) => {
    //         // state 변경
    //     },
    //     [
    //         /* 연관배열: 콜백 메서드에서 변경하고자 하는 연관되는 상태(변수)명들을 기술 */
    //     ]
    // );

    // // 이벤트 핸들러 작성.
    // const handler = (e) => {
    //     // 이벤트 핸들러는 화살표 함수로 만든다
    //     console.log(e.target);
    // };

    // JSX로 화면 만들기. 조건부 렌더링: https://ko.reactjs.org/docs/conditional-rendering.html
    return (
        <StyledProject>
            <div className="container">
                <div className="project_items">
                    {projectItems?.map((item) => (
                        <div className="project_item" key={item.id}>
                            <div className="img_area">
                                <img src={item.img_url} alt={item.title} />
                            </div>

                            <div className="txt_area">
                                <p className="sub_tit">{item.title}</p>

                                <ul className="tag_list">
                                    {item.tags?.map((t, idx) => (
                                        <li key={idx}>{t}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </StyledProject>
    );
}

export default React.memo(Project); // React.memo()는 props 미변경시 컴포넌트 리렌더링 방지 설정
