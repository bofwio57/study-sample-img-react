import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import ProjectItem from "./ProjectItem";

const StyledProject = styled.section`
    padding-bottom: 15rem;
`;

function Project({ projectItems, addProject }) {
    return (
        <StyledProject>
            <div className="container">
                {/* 변수 이름 = {변수내용} */}
                <ProjectItem projectItems={projectItems} addProject={addProject} />
            </div>
        </StyledProject>
    );
}
Project.propTypes = {
    projectItems: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
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
