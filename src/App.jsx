import { useState, useEffect } from "react";
import useLenis from "./hook/useLenis";
import Header from "./components/Header";
import Project from "./components/Project";
import { supabase } from "./lib/supabase";

function App() {
    //스크롤
    const lenisRef = useLenis();

    //top 버튼
    const [showTop, setShowTop] = useState(false); // Top 버튼 노출 여부

    //필터 tag
    const [filters, setFilters] = useState([]); //중복없는 필터 전체값
    const [activeFilter, setActiveFilter] = useState("all"); //현재 선택된 필터 > 초기값 all

    //전체 프로젝트 목록
    const [projectItems, setProjectItems] = useState([]);

    //toast
    const [toastMessage, setToastMessage] = useState(""); //Message 제어
    const [showToastFlag, setShowToastFlag] = useState(false); //Toast가 있는지 없는지

    // 최초 Supabase 데이터 조회 (READ)
    useEffect(() => {
        fetchFilters();
    }, []);
    const fetchFilters = async () => {
        try {
            let { data: project, error } = await supabase.from("project").select("*");

            if (error) {
                console.log("Supabase 데이터 조회 오류:", error);
                return;
            }

            // 프로젝트 목록 상태에 저장
            // 데이터가 있으면 데이터를 없으면 빈값[]을
            setProjectItems(project || []);
        } catch (error) {
            console.log(error);
        }
    };

    //tag 리스트
    useEffect(() => {
        //모든 tags를 하나로 합침
        const allTags = projectItems.flatMap((item) => item.tags || []);

        //Set을 이용해 중복 제거
        const uniqueTags = [...new Set(allTags)];

        setFilters(uniqueTags);
    }, [projectItems]); //프로젝트가 갱신될때 마다 실행

    // 관리자 비밀번호 검증
    const checkAdmin = async (password) => {
        const { data, error } = await supabase.rpc("check_admin_password", {
            input_password: password,
        });

        if (error || !data) {
            alert("비밀번호가 틀렸습니다");
            return false;
        }

        return true;
    };

    //파일명 생성
    const generateFileName = (file) => {
        //점으로 자르고 가장 마지막 문자 = 확장자
        const fileExt = file.name.split(".").pop();

        //확장자만 제거한 이름 부분
        const baseName = file.name.replace(`.${fileExt}`, "");

        //이름_날짜(중복방지).확장자
        return `${baseName}_${Date.now()}.${fileExt}`;
    };

    //프로젝트 데이터 추가(CREATE)
    const addProject = async ({ title, tags, file, password }) => {
        // 관리자 비밀번호 인증
        const isAdmin = await checkAdmin(password);
        if (!isAdmin) return;

        let imgUrl = "";

        // 이미지가 있다면 이미지 업로드
        if (file) {
            try {
                const fileName = generateFileName(file); //파일명_날짜.확장자

                const { uploadError } = await supabase.storage
                    .from("project_img") //storage 이름
                    .upload(fileName, file);

                if (uploadError) {
                    console.error("Supabase 파일 업로드 오류:", uploadError);
                    return;
                }

                // 업로드 후 public URL 획득
                const { data } = supabase.storage
                    .from("project_img") //storage 이름
                    .getPublicUrl(fileName);

                imgUrl = data.publicUrl;
            } catch (uploadException) {
                console.error("이미지 처리 중 예상치 못한 오류:", uploadException);
                return;
            }
        }

        try {
            // 데이터 입력(INSERT)
            const { data, error } = await supabase
                .from("project")
                .insert([{ title, tags, img_url: imgUrl }])
                .select();

            if (error) {
                console.error("Supabase 데이터 INSERT 오류:", error);
                return;
            }

            // 프로젝트 즉시 갱신 > 최신 프로젝트를 맨 앞에 추가
            setProjectItems((prev) => [data[0], ...prev]);
        } catch (error) {
            console.log(error);
        }
    };

    //필터링 기능
    const filteredProjects =
        activeFilter === "all"
            ? projectItems //전체일때
            : projectItems.filter((project) => project.tags.includes(activeFilter)); //필터링

    // top 기능
    useEffect(() => {
        const onScroll = () => {
            setShowTop(window.scrollY > 200);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    //URL에서 파일명 추출
    const getFileNameFromUrl = (url) => {
        if (!url) return null;
        return url.split("/").pop();
    };

    // 프로젝트 복사 + Toast
    const handleCopyFileClick = (title) => {
        navigator.clipboard
            .writeText(title)
            .then(() => {
                setToastMessage(title);
                setShowToastFlag(true);

                // 1.5초 후 토스트 숨기기
                setTimeout(() => {
                    setShowToastFlag(false);
                }, 1500);
            })
            .catch((err) => console.error(err));
    };

    // 프로젝트 수정 (UPDATE)
    const updateProject = async (id, { title, tags, file, password }) => {
        // 관리자 비밀번호 인증
        const isAdmin = await checkAdmin(password);
        if (!isAdmin) return;

        let updateData = { title, tags };

        // 이미지 변경 시
        if (file) {
            // 기존 이미지 조회
            const { data: oldProject } = await supabase
                .from("project")
                .select("img_url") //img_url값을 받아와라
                .eq("id", id)
                .single();

            // 기존 이미지 삭제
            if (oldProject?.img_url) {
                const oldFileName = getFileNameFromUrl(oldProject.img_url); //기존 이미지 명
                if (oldFileName) {
                    await supabase.storage.from("project_img").remove([oldFileName]);
                }
            }

            // 새 이미지 업로드
            const updateFileName = generateFileName(file); //파일명_날짜.확장자
            const { error: uploadError } = await supabase.storage
                .from("project_img") //storage 이름
                .upload(updateFileName, file);

            if (uploadError) {
                console.error(uploadError);
                return;
            }

            //새 이미지 url 값 가져오기
            updateData.img_url = supabase.storage
                .from("project_img") //storage 이름
                .getPublicUrl(updateFileName).data.publicUrl;
        }

        // 데이터 업데이트
        const { data, error } = await supabase
            .from("project") //table 명
            .update(updateData)
            .eq("id", id)
            .select();

        if (error) return console.error(error);

        //상태 업데이트
        setProjectItems((prev) => prev.map((item) => (item.id === id ? data[0] : item)));
    };

    // 프로젝트 삭제 (DELETE)
    const deleteProject = async (id, password) => {
        // 관리자 비밀번호 인증
        const isAdmin = await checkAdmin(password);
        if (!isAdmin) return;

        // 삭제할 프로젝트(기존) 이미지 조회 (이미지 URL 얻기)
        const { data: project, error: fetchError } = await supabase.from("project").select("img_url").eq("id", id).single(); //객체 한개로 온다고 배열이 아니고

        if (fetchError) {
            console.error(fetchError);
            return;
        }

        // Storage 이미지 삭제
        if (project?.img_url) {
            //project가 존재할 때만 img_url에 접근하라
            const fileName = getFileNameFromUrl(project.img_url); //파일명

            if (fileName) {
                const { error: storageError } = await supabase.storage
                    .from("project_img") //
                    .remove([fileName]);

                if (storageError) {
                    console.error("이미지 삭제 실패:", storageError);
                }
            }
        }

        // Table row 삭제
        const { error } = await supabase.from("project").delete().eq("id", id);
        if (error) return console.error(error);

        // 상태 업데이트
        setProjectItems((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <>
            <div id="wrap">
                <main>
                    <Header filters={filters} activeFilter={activeFilter} onChange={setActiveFilter} />
                    <Project
                        projectItems={filteredProjects}
                        addProject={addProject}
                        onCopyFileClick={handleCopyFileClick}
                        updateProject={updateProject}
                        deleteProject={deleteProject}
                    />
                </main>
            </div>
            <div
                id="btn_top"
                aria-label="페이지 상단으로 이동"
                className={showTop ? "show" : ""}
                onClick={() =>
                    lenisRef.current?.scrollTo(0, {
                        duration: 0.6,
                        easing: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
                    })
                }
            >
                <span className="material-symbols-outlined"> arrow_upward </span>
            </div>
            <div id="project_toast" className={showToastFlag ? "show" : ""}>
                {toastMessage}
            </div>
        </>
    );
}
// App은 루트 컴포넌트고 props를 안 받는다.
// → propTypes 쓰지 않는 게 정상
export default App;
