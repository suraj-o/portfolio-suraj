import { useEffect } from "react";
import { COLORS, GLOBAL_STYLES } from "./theme";
import { Terminal } from "./components/Terminal";

export default function App(): JSX.Element {
    // Inject global styles
    useEffect(() => {
        const style = document.createElement("style");
        style.textContent = GLOBAL_STYLES;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                background: COLORS.pageBg,
                overflow: "hidden",
            }}
        >
            <Terminal />
        </div>
    );
}
