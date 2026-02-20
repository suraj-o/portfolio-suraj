import { COLORS } from "../theme";

export function TitleBar(): JSX.Element {
    return (
        <div
            style={{
                background: COLORS.headerBg,
                padding: "10px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: `1px solid ${COLORS.border}`,
                userSelect: "none",
            }}
        >
            {/* Left: star + name */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                    style={{
                        color: COLORS.aiStarIcon,
                        fontSize: 16,
                        lineHeight: 1,
                    }}
                >
                    ✦
                </span>
                <span
                    style={{
                        color: COLORS.headerTitle,
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: 0.5,
                    }}
                >
                    suraj-portfolio
                </span>
                <span
                    style={{
                        color: COLORS.muted,
                        fontSize: 11,
                    }}
                >
                    ─
                </span>
                <span
                    style={{
                        color: COLORS.muted,
                        fontSize: 11,
                    }}
                >
                    interactive mode
                </span>
            </div>

            {/* Right: version info */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                    style={{
                        color: COLORS.accentOrange,
                        fontSize: 10,
                        fontWeight: 700,
                        background: `${COLORS.accentOrange}15`,
                        border: `1px solid ${COLORS.accentOrange}40`,
                        borderRadius: 3,
                        padding: "1px 6px",
                    }}
                >
                    AI
                </span>
                <span
                    style={{
                        color: COLORS.headerSub,
                        fontSize: 11,
                    }}
                >
                    v1.0
                </span>
            </div>
        </div>
    );
}
