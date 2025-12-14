import React, { useState, useEffect, useRef, useCallback, useMemo, useReducer, Fragment, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { supabase } from "../lib/supabase";

export const ModalArea = styled.div`
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgb(0 0 0 / 57%);
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const PopupCard = styled.div`
    width: 100%;
    max-width: 550px;
    border-radius: 10px;
    background-color: #161616;
    border: 1px solid #ffffff1a;
    box-shadow: 0 0 0 1px #ffffff14, 0px 4px 8px rgba(0, 0, 0, 0.3);
    overflow: hidden;
`;

export const CardHead = styled.header`
    padding: 16px 20px;
    color: #fff;

    h2 {
        margin: 0;
        font-size: 18px;
    }
`;

export const CardBody = styled.section`
    padding: 18px;

    label {
        font-size: 13px;
        color: #fff;
    }
`;

export const CardFoot = styled.footer`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 12px 18px;
`;

export const FormRow = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;

    & + & {
        margin-top: 25px;
    }
`;

export const Input = styled.input`
    padding: 10px;
    border-radius: 8px;
    font-size: 14px;
    background-color: #232325;
    color: #aaa;
    border: none;
    outline: none;

    &[type="file"]::file-selector-button {
        width: 90px;
        height: 30px;
        margin-right: 10px;
        backdrop-filter: blur(10px);
        background-color: #eeeeeea8;
        color: #212121;
        border: none;
        border-radius: 6px;
        cursor: pointer;
    }
`;

export const Button = styled.button`
    padding: 8px 20px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.35s ease;

    ${({ variant }) =>
        variant === "primary" &&
        css`
            backdrop-filter: blur(10px);
            background-color: #eeeeeea8;
            color: #212121;

            &:hover {
                background-color: #fff;
            }
        `}

    ${({ variant }) =>
        variant === "ghost" &&
        css`
            background: transparent;
            border: 1px solid #ffffff1a;
            color: #7c7c7c;

            &:hover {
                background: #1e1e20;
                color: #fff;
            }
        `}
`;

function ProjectModal({ onClose, onAddProject }) {
    const [title, setTitle] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [file, setFile] = useState(null);

    const extractTags = (input) => {
        return input
            .split("/") // "/" 기준 분리
            .map((t) => t.trim()) // 공백 제거
            .filter(Boolean); // 빈 문자열 제거
    };
    const handleSubmit = async () => {
        if (!title) return;

        let imgUrl = "";

        // 1️⃣ 이미지 업로드
        if (file) {
            const fileExt = file.name.split(".").pop(); //점으로 자르고 가장 마지막 문자 = 확장자
            const baseName = file.name.replace(`.${fileExt}`, ""); //확장자만 제거한 이름 부분
            const fileName = `${baseName}_${Date.now()}.${fileExt}`; //파일명_날짜.확장자

            const { error } = await supabase.storage.from("project_img").upload(fileName, file);

            if (error) {
                console.error(error);
                return;
            }

            // 2️⃣ public URL 생성
            const { data } = supabase.storage.from("project_img").getPublicUrl(fileName);

            imgUrl = data.publicUrl;
        }

        // 🔥 여기서 최종 태그 추출
        const finalTags = extractTags(tagInput);

        const newProject = {
            title,
            tags: finalTags,
            img_url: imgUrl,
        };

        await onAddProject(newProject);
        onClose();
    };

    return (
        <ModalArea role="dialog" aria-modal="true" onClick={onClose}>
            <PopupCard onClick={(e) => e.stopPropagation()}>
                <CardHead>
                    <h2>NEW PROJECT</h2>
                </CardHead>

                <CardBody>
                    <FormRow>
                        <label>제목</label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="프로젝트 제목" />
                    </FormRow>

                    <FormRow>
                        <label>태그</label>
                        <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="단어/단어/단어" />
                    </FormRow>

                    <FormRow>
                        <label>이미지</label>
                        <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
                    </FormRow>
                </CardBody>

                <CardFoot>
                    <Button variant="ghost" onClick={onClose}>
                        취소
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        추가
                    </Button>
                </CardFoot>
            </PopupCard>
        </ModalArea>
    );
}

ProjectModal.propTypes = {
    // props의 프로퍼티 타입 설정. https://ko.reactjs.org/docs/typechecking-with-proptypes.html
    // 인자명: PropTypes.func.isRequired,
    // 인자명: PropTypes.arrayOf(PropTypes.object),
};
ProjectModal.defaultProps = {
    // props의 디폴트 값 설정. https://ko.reactjs.org/docs/typechecking-with-proptypes.html
    // 인자명: () => {},
    // 인자명: [],
};

export default React.memo(ProjectModal); // React.memo()는 props 미변경시 컴포넌트 리렌더링 방지 설정
