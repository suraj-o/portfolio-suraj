import { COLORS } from "../theme";

interface AIBubbleProps {
    message: string;
    equivalentCmd: string;
    openUrl?: string;
    onRunCommand: (cmd: string) => void;
}

export function AIBubble({ message, equivalentCmd, openUrl, onRunCommand }: AIBubbleProps): JSX.Element {
    return (
        <div
            style={{
                background: COLORS.aiBubbleBg,
                borderLeft: `3px solid ${COLORS.aiBubbleAccent}`,
                borderRadius: "0 6px 6px 0",
                padding: "14px 18px",
                margin: "8px 0",
                animation: "fadeIn 0.3s ease-out",
            }}
        >
            {/* Star icon + label */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span
                    style={{
                        color: COLORS.aiStarIcon,
                        fontSize: 14,
                    }}
                >
                    ✦
                </span>
                <span
                    style={{
                        color: COLORS.aiStarIcon,
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                    }}
                >
                    Assistant
                </span>
            </div>

            {/* Response body */}
            <div style={{ color: COLORS.cmdText, fontSize: 13, lineHeight: 1.8, paddingLeft: 22 }}>
                {message}
            </div>

            {/* Opened URL link */}
            {openUrl && (
                <div style={{ marginTop: 10, paddingLeft: 22 }}>
                    <a
                        href={openUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: COLORS.accentCyan,
                            fontSize: 12,
                            textDecoration: "underline",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        🔗 Opened in new tab
                    </a>
                </div>
            )}

            {/* Equivalent command */}
            {equivalentCmd && (
                <div style={{ marginTop: 12, paddingLeft: 22 }}>
                    <span
                        onClick={() => onRunCommand(equivalentCmd)}
                        style={{
                            color: COLORS.accentGreen,
                            cursor: "pointer",
                            fontWeight: 700,
                            fontSize: 12,
                            background: `${COLORS.accentGreen}10`,
                            border: `1px solid ${COLORS.accentGreen}30`,
                            borderRadius: 4,
                            padding: "3px 10px",
                            display: "inline-block",
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") onRunCommand(equivalentCmd);
                        }}
                    >
                        ❯ {equivalentCmd}
                    </span>
                </div>
            )}
        </div>
    );
}

export function ThinkingIndicator(): JSX.Element {
    return (
        <div style={{ color: COLORS.outputText, fontSize: 13, padding: "8px 0", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: COLORS.aiStarIcon, animation: "pulse 1s infinite" }}>✦</span>
            <span style={{ color: COLORS.muted }}>thinking...</span>
        </div>
    );
}
