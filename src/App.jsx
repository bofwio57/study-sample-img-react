import { useState, useEffect } from "react";
import useLenis from "./hook/useLenis";
import Header from "./components/Header";
import Project from "./components/Project";
import { supabase } from "./lib/supabase";

function App() {
    const lenisRef = useLenis();
    const [filters, setFilters] = useState([]); //필터 tag
    const [projectItems, setProjectItems] = useState([]); //프로젝트
    const [activeFilter, setActiveFilter] = useState("all");
    const [showTop, setShowTop] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [showToastFlag, setShowToastFlag] = useState(false);

    // 데이터 조회 (READ)
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

            // 데이터가 있으면 데이터를 없으면 빈값[]을
            // 1) 모든 tags를 하나로 합치기
            // 2) 중복 제거

            //태그
            const uniqueTags = [...new Set(project.flatMap((row) => row.tags || []))];
            setFilters(uniqueTags);

            //프로젝트
            setProjectItems(project || []);
        } catch (error) {
            console.log(error);
        }
    };

    //데이터를 추가(CREATE)
    const addProject = async ({ title, tags, file }) => {
        let imgUrl = "";

        if (file) {
            try {
                // 1️⃣ 이미지 업로드
                const fileExt = file.name.split(".").pop(); //점으로 자르고 가장 마지막 문자 = 확장자
                const baseName = file.name.replace(`.${fileExt}`, ""); //확장자만 제거한 이름 부분
                const fileName = `${baseName}_${Date.now()}.${fileExt}`; //파일명_날짜.확장자

                const { uploadError } = await supabase.storage.from("project_img").upload(fileName, file);

                if (uploadError) {
                    console.error("Supabase 파일 업로드 오류:", uploadError);
                    return;
                }

                // 2️⃣ public URL 읽기(가져오기)
                const { data } = supabase.storage.from("project_img").getPublicUrl(fileName);
                imgUrl = data.publicUrl;
            } catch (uploadException) {
                console.error("이미지 처리 중 예상치 못한 오류:", uploadException);
                return;
            }
        }

        try {
            // 3️⃣ 데이터 INSERT
            const { data, error } = await supabase
                .from("project")
                .insert([{ title, tags, img_url: imgUrl }])
                .select();

            if (error) {
                console.error("Supabase 데이터 INSERT 오류:", error);
                return;
            }

            // 프로젝트 즉시 갱신 > 새로운거 앞으로
            setProjectItems((prev) => [data[0], ...prev]);

            // 태그 즉시 갱신
            setFilters((prev) => [...new Set([...prev, ...(data[0].tags || [])])]);
        } catch (error) {
            console.log(error);
        }
    };

    const filteredProjects = activeFilter === "all" ? projectItems : projectItems.filter((project) => project.tags.includes(activeFilter));

    useEffect(() => {
        const onScroll = () => {
            setShowTop(window.scrollY > 200);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleProjectClick = (title) => {
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

    return (
        <>
            <div id="wrap">
                <main>
                    <Header filters={filters} activeFilter={activeFilter} onChange={setActiveFilter} />
                    <Project projectItems={filteredProjects} addProject={addProject} onItemClick={handleProjectClick} />
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
