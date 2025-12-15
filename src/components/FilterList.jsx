import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

const StyledFilterList = styled.ul`
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;

    li {
        display: flex;
        padding: 0 0.85em !important;
        height: 2em;
        border: 1px solid #ffffff1a;
        border-radius: 3rem;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        color: #7c7c7c;
        min-width: 2rem;
        transition: all 0.2s ease;

        &:hover {
            color: #fff;
        }

        &.active {
            background: #1e1e20;
            color: #fff;
        }
    }
`;

function FilterList({ filters }) {
    return (
        <StyledFilterList>
            <li data-filter="all">all</li>
            {filters.map((item, idx) => (
                <li key={idx} data-filter={item}>
                    {item}
                </li>
            ))}
        </StyledFilterList>
    );
}
FilterList.propTypes = {
    filters: PropTypes.arrayOf(PropTypes.string).isRequired,
};
export default React.memo(FilterList);
