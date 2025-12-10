import { useState } from "react";
import Header from "./components/Header";

function App() {
    return (
        <>
            <div id="wrap">
                <main>
                    <Header />
                </main>
            </div>
            <div id="btn_top" aria-label="페이지 상단으로 이동">
                <span className="material-icons" aria-hidden="true">
                    arrow_upward
                </span>
            </div>
            <div id="project_toast"></div>
        </>
    );
}

export default App;
