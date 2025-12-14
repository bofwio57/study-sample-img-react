import React, { useState, useEffect, useCallback } from "react";
import styled, { css } from "styled-components";
import { supabase } from "../lib/supabase";
import ProjectItem from "./ProjectItem";

const StyledProject = styled.section`
    padding-bottom: 15rem;
`;

function Project() {
    const [projectItems, setProjectItems] = useState([]);

    // 데이터 조회 (READ)
    useEffect(() => {
        fetchProject();
    }, []);

    const fetchProject = async () => {
        try {
            let { data: project, error } = await supabase.from("project").select("*");

            if (error) {
                console.error(error);
                return;
            }

            //데이터가 있으면 데이터를 없으면 빈값[]을
            setProjectItems(project || []);
        } catch (error) {
            console.log(error);
        }
    };

    //데이터를 추가(CREATE)
    const addProject = async (newProject) => {
        try {
            const { data, error } = await supabase.from("project").insert([newProject]).select();
            if (error) {
                console.error(error);
                return;
            }

            // 즉시 UI 반영
            setProjectItems((prev) => [data[0], ...prev]);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <StyledProject>
            <div className="container">
                {/* 변수 이름 = {변수내용} */}
                <ProjectItem projectItems={projectItems} onAddProject={addProject} />
            </div>
        </StyledProject>
    );
}

export default React.memo(Project); // React.memo()는 props 미변경시 컴포넌트 리렌더링 방지 설정
