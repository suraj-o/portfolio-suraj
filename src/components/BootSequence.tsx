import { useState, useEffect } from "react";
import { COLORS } from "../theme";

interface BootLine {
    text: string;
    color: string;
    indent?: boolean;
}

const BOOT_LINES: BootLine[] = [
    { text: "✦ suraj-code v1.0 — portfolio mode", color: COLORS.accentOrange },
    { text: "  Loading portfolio modules...", color: COLORS.outputText, indent: true },
    { text: "  ✓ skills    ✓ experience    ✓ projects    ✓ ai-agent", color: COLORS.accentGreen, indent: true },
    { text: "  All systems operational.", color: COLORS.accentGreen, indent: true },
    { text: "", color: "transparent" },
    { text: "  Ready. Here's how to get started:", color: COLORS.cmdText, indent: true },
    { text: "", color: "transparent" },
    { text: "  💡 Type 'help' to see all available commands", color: COLORS.outputText, indent: true },
    { text: "  💬 Or just ask anything — e.g. \"tell me about this person\"", color: COLORS.outputText, indent: true },
];

interface BootSequenceProps {
    onComplete: () => void;
}

export function BootSequence({ onComplete }: BootSequenceProps): JSX.Element {
    const [visibleLines, setVisibleLines] = useState<number>(0);

    useEffect(() => {
        if (visibleLines < BOOT_LINES.length) {
            const timer = setTimeout(() => {
                setVisibleLines((prev) => prev + 1);
            }, 280);
            return () => clearTimeout(timer);
        } else {
            const finishTimer = setTimeout(onComplete, 400);
            return () => clearTimeout(finishTimer);
        }
    }, [visibleLines, onComplete]);

    return (
        <div style={{ padding: "8px 0" }}>
            {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
                <div
                    key={i}
                    style={{
                        color: line.color,
                        lineHeight: 1.8,
                        fontSize: 13,
                        animation: "fadeIn 0.3s ease-out",
                    }}
                >
                    {line.text}
                </div>
            ))}
        </div>
    );
}
