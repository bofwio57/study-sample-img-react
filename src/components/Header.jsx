import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import FilterList from "./FilterList";

const StyledHeader = styled.section`
    padding: 6rem;

    .container {
        justify-items: center;
        text-align: center;
    }

    .main_tit h1 {
        font-family: "Montserrat", sans-serif;
        font-size: 72px;
        font-weight: 800;
        font-style: italic;
        letter-spacing: -0.025em;
        margin: 0 0 2rem;
        line-height: 1;
        color: #fff;
    }
`;

function Header({ filters }) {
    return (
        <StyledHeader>
            <div className="container">
                <div className="main_tit">
                    <h1>Example Hub</h1>
                </div>
                <FilterList filters={filters} />
            </div>
        </StyledHeader>
    );
}
Header.propTypes = {
    filters: PropTypes.arrayOf(PropTypes.string).isRequired,
};
export default React.memo(Header);
