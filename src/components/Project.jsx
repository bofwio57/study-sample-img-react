import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import ProjectModal from "./ProjectModal";

const StyledProject = styled.section`
    padding-bottom: 15rem;
    .project_items {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 2rem;
    }
    .project_items.show {
        opacity: 1;
    }
    .project_item {
        border-radius: 10px;
        overflow: hidden;
        background-color: #161616;
        border: 1px solid #ffffff1a;

        .btn_area {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1px solid #ffffff0d;
            padding: 1rem 0;
            margin: 1.5rem 1rem 0 1rem;
            gap: 20px;
        }

        .img_area {
            overflow: hidden;
            width: 100%;
            position: relative;
            aspect-ratio: 800 / 600;

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
                padding: 1.5rem 1rem;
                transition: color 0.2s ease;
                color: #7c7c7c;
            }
        }

        &:hover .txt_area .sub_tit {
            color: #fff;
        }
    }
    .btn_icon {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        justify-content: center;
        background: transparent;
        border: 1px solid #ffffff1a;
        color: #7c7c7c;
        padding: 8px 20px;
        border-radius: 8px;
        transition: all 0.35s ease;

        &:hover {
            background: #1e1e20;
            color: #fff;
        }
    }

    .tag_list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.2rem;
        padding: 0 1rem;

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
    .project_add {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #7c7c7c;
        backdrop-filter: blur(10px);
        border-radius: 10px;
        border: 2px dashed #ffffff1a;
        transition: all 0.6s ease;

        &:hover {
            border-color: #ffffff70;
            color: #fff;
        }
    }
    .txt_box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
        p {
            font-size: 22px;
        }
        span {
            font-size: 30px;
            background-color: rgb(35 35 37);
            border-radius: 50%;
            padding: 20px;
        }
    }
    @media (max-width: 991px) {
        padding-bottom: 10rem;
        .txt_box {
            p {
                font-size: 1rem;
            }
        }
    }
    @media (max-width: 767px) {
        .project_items {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    @media (max-width: 576px) {
        .project_items {
            grid-template-columns: repeat(1, 1fr);
        }
        .project_add {
            aspect-ratio: 800 / 770;
        }
    }
`;

function Project({ projectItems, addProject, onCopyFileClick, updateProject, deleteProject }) {
    // projectItems > 필터링된 아이템
    const [isModalOpen, setIsModalOpen] = useState(false); //모달 관련

    const [editingProject, setEditingProject] = useState(null);

    // 🔥 body 제어: 모달이 열리면 스크롤 막기
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isModalOpen]);

    return (
        <StyledProject>
            <div className="container">
                <div className="project_items">
                    <div
                        className="project_add"
                        onClick={() => {
                            setEditingProject(null);
                            setIsModalOpen(true);
                        }}
                    >
                        <div className="txt_box">
                            <span className="material-symbols-outlined">add</span>
                            <p>NEW PROJECT</p>
                        </div>
                    </div>
                    {projectItems?.map((item) => (
                        <div className="project_item" key={item.id}>
                            <div className="img_area">
                                <img src={item.img_url || null} alt={item.title} />
                            </div>

                            <div className="txt_area">
                                <p className="sub_tit">{item.title}</p>

                                <ul className="tag_list">
                                    {item.tags?.map((tag) => (
                                        <li key={tag}>{tag}</li>
                                    ))}
                                </ul>
                                <div className="btn_area">
                                    <button
                                        className="btn btn_icon"
                                        onClick={() => {
                                            setEditingProject(item);
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        <span className="material-symbols-outlined"> edit</span>
                                        수정
                                    </button>
                                    <button className="btn btn_icon" id="btn_copy" onClick={() => onCopyFileClick(item.title)}>
                                        <span className="material-symbols-outlined"> content_copy </span>
                                        복사
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* 모달 */}
                    {isModalOpen && (
                        <ProjectModal
                            onClose={() => setIsModalOpen(false)}
                            addProject={addProject}
                            updateProject={updateProject}
                            deleteProject={deleteProject}
                            editingProject={editingProject}
                        />
                    )}
                </div>
            </div>
        </StyledProject>
    );
}
Project.propTypes = {
    projectItems: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired, //숫자 타입과 문자열 타입 둘다 가능
            title: PropTypes.string.isRequired,
            img_url: PropTypes.string,
            tags: PropTypes.arrayOf(PropTypes.string),
        }),
    ),
    addProject: PropTypes.func.isRequired,
    onCopyFileClick: PropTypes.func.isRequired,
};
Project.defaultProps = {
    projectItems: [],
};

export default React.memo(Project); // React.memo()는 props 미변경시 컴포넌트 리렌더링 방지 설정
