import { COLORS } from "../theme";

interface InputRowProps {
    value: string;
    onChange: (val: string) => void;
    onSubmit: () => void;
    onArrowUp: () => void;
    onArrowDown: () => void;
    onTab: () => void;
    inputRef: React.RefObject<HTMLInputElement | null>;
    disabled: boolean;
}

export function InputRow({
    value,
    onChange,
    onSubmit,
    onArrowUp,
    onArrowDown,
    onTab,
    inputRef,
    disabled,
}: InputRowProps): JSX.Element {
    return (
        <div style={{ display: "flex", alignItems: "center", minHeight: 28 }}>
            {/* Claude-style chevron prompt */}
            <span
                style={{
                    color: COLORS.promptChevron,
                    fontWeight: 700,
                    fontSize: 15,
                    marginRight: 10,
                }}
            >
                ❯
            </span>

            {/* Visible text + cursor */}
            <span style={{ color: COLORS.cmdText, position: "relative", flex: 1 }}>
                {value}
                <span
                    style={{
                        display: "inline-block",
                        width: 8,
                        height: 2,
                        background: COLORS.promptChevron,
                        animation: "blink 1s step-end infinite",
                        verticalAlign: "middle",
                        marginLeft: 1,
                        marginBottom: -2,
                    }}
                />
            </span>

            {/* Hidden input for capturing keystrokes */}
            <input
                ref={inputRef as React.Ref<HTMLInputElement>}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        onSubmit();
                    } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        onArrowUp();
                    } else if (e.key === "ArrowDown") {
                        e.preventDefault();
                        onArrowDown();
                    } else if (e.key === "Tab") {
                        e.preventDefault();
                        onTab();
                    }
                }}
                disabled={disabled}
                style={{
                    position: "absolute",
                    opacity: 0,
                    width: 0,
                    height: 0,
                    border: "none",
                    padding: 0,
                }}
                autoComplete="off"
                spellCheck={false}
                aria-label="Terminal input"
            />
        </div>
    );
}

// ─── Prompt line for historical entries ───
interface PromptLineProps {
    cmd: string;
}

export function PromptLine({ cmd }: PromptLineProps): JSX.Element {
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <span
                style={{
                    color: COLORS.muted,
                    fontWeight: 700,
                    fontSize: 15,
                    marginRight: 10,
                }}
            >
                ❯
            </span>
            <span style={{ color: COLORS.cmdText }}>{cmd}</span>
        </div>
    );
}
