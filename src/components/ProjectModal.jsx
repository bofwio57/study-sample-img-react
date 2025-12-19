import React, { useState, useEffect, useRef, useCallback, useMemo, useReducer, Fragment, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

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
    @media (max-width: 576px) {
        max-width: 100%;
        margin: 0 30px;
    }
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

        small {
            color: #eeeeee96;
            margin-left: 10px;
            font-size: 13px;
        }
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

    &.primary {
        backdrop-filter: blur(10px);
        background-color: #eeeeeea8;
        color: #212121;

        &:hover {
            background-color: #fff;
        }
    }

    &.ghost {
        background: transparent;
        border: 1px solid #ffffff1a;
        color: #7c7c7c;

        &:hover {
            background: #1e1e20;
            color: #fff;
        }
    }
`;

function ProjectModal({ onClose, addProject }) {
    //db에 추가될 데이터 값을 받아오기 위해
    const [title, setTitle] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState("");

    //필터값 받아오기
    const extractTags = (input) =>
        input
            .split("/")
            .map((t) => t.trim())
            .filter(Boolean);

    const handleSubmit = () => {
        if (!title) return; //타이틀은 필수라

        addProject({
            title,
            tags: extractTags(tagInput),
            file, // 🔥 파일 그대로 전달 >app에서 파일 관련 db 처리하기 때문
            password,
        });

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
                        <label>
                            이미지<small>* 한글 파일명 불가</small>
                        </label>
                        <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
                    </FormRow>
                    <FormRow>
                        <label>관리자 비밀번호</label>
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </FormRow>
                </CardBody>

                <CardFoot>
                    <Button className="ghost" onClick={onClose}>
                        취소
                    </Button>
                    <Button className="primary" onClick={handleSubmit}>
                        추가
                    </Button>
                </CardFoot>
            </PopupCard>
        </ModalArea>
    );
}

ProjectModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    addProject: PropTypes.func.isRequired,
};
ProjectModal.defaultProps = {
    // 둘다 필수라 없으면 안됨
};

export default React.memo(ProjectModal); // React.memo()는 props 미변경시 컴포넌트 리렌더링 방지 설정
