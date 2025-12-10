import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { supabase } from "../lib/supabase";

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

function FilterList({ ...props }) {
    const [filters, setFilers] = useState([]);

    useEffect(() => {
        fetchFilers();
    }, []);

    const fetchFilers = async () => {
        try {
            let { data: project, error } = await supabase.from("project").select("tags");

            if (error) {
                console.log(error);
                return;
            }

            // 1) 모든 tags를 하나로 합치기
            // 2) 중복 제거
            const uniqueTags = [...new Set(project.flatMap((row) => row.tags || []))];

            setFilers(uniqueTags);
        } catch (error) {
            console.log(error);
        }
    };

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

export default React.memo(FilterList);
