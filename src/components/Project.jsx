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
    .project_add {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #aaa;
        transition: all 0.2s ease;
        backdrop-filter: blur(10px);
        border-radius: 10px;
        background-color: #161616;
        border: 1px solid #ffffff1a;
        &:hover {
            color: #212121;
            background-color: #eeeeeea8;
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
        }
    }
`;

function Project({ projectItems, addProject }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 🔥 body 제어
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
                    <div className="project_add" onClick={() => setIsModalOpen(true)}>
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
                            </div>
                        </div>
                    ))}
                    {/* 모달 */}
                    {isModalOpen && <ProjectModal onClose={() => setIsModalOpen(false)} addProject={addProject} />}
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
        })
    ),
    addProject: PropTypes.func.isRequired,
};
Project.defaultProps = {
    projectItems: [],
};

export default React.memo(Project); // React.memo()는 props 미변경시 컴포넌트 리렌더링 방지 설정
