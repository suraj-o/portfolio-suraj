import { useState, useEffect, useRef, useCallback } from "react";
import type { PortfolioData, LineEntry } from "../types";
import { COLORS } from "../theme";
import { fetchPortfolioData, askAI } from "../api";
import { classifyInput } from "../classifier";
import { processCommand } from "../commands";
import { TitleBar } from "./TitleBar";
import { BootSequence } from "./BootSequence";
import { InputRow, PromptLine } from "./InputRow";
import { AIBubble, ThinkingIndicator } from "./AIBubble";
import { WelcomeGuide } from "./WelcomeGuide";
import { AutocompleteDropdown, getFilteredCommands } from "./AutocompleteDropdown";

let lineIdCounter = 0;

export function Terminal(): JSX.Element {
    const [data, setData] = useState<PortfolioData | null>(null);
    const [lines, setLines] = useState<LineEntry[]>([]);
    const [input, setInput] = useState("");
    const [cmdHistory, setCmdHistory] = useState<string[]>([]);
    const [histIdx, setHistIdx] = useState(-1);
    const [isThinking, setIsThinking] = useState(false);
    const [bootDone, setBootDone] = useState(false);
    const [guideDone, setGuideDone] = useState(false);
    const [acIdx, setAcIdx] = useState(-1);
    const [aiCredits, setAiCredits] = useState(5);

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    // ─── Fetch data on mount ───
    useEffect(() => {
        fetchPortfolioData()
            .then(setData)
            .catch((err: unknown) => {
                console.error("Failed to fetch portfolio data:", err);
            });
    }, []);

    // ─── Auto-scroll to bottom ───
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [lines, isThinking]);

    // ─── Focus input after boot ───
    useEffect(() => {
        if (bootDone) {
            inputRef.current?.focus();
        }
    }, [bootDone]);

    // ─── Execute a CLI command ───
    const runCliCommand = useCallback(
        (cmd: string) => {
            const output = processCommand(cmd, data, cmdHistory);

            // Handle clear
            if (cmd.trim().toLowerCase() === "clear") {
                setLines([]);
                return;
            }

            const entry: LineEntry = {
                id: ++lineIdCounter,
                cmd,
                mode: "cli",
                output,
            };

            setLines((prev) => [...prev, entry]);
        },
        [data, cmdHistory]
    );

    // ─── Execute an AI query ───
    const runAIQuery = useCallback(
        async (userMessage: string) => {
            // Add thinking placeholder
            const thinkingId = ++lineIdCounter;
            const thinkingEntry: LineEntry = {
                id: thinkingId,
                cmd: userMessage,
                mode: "ai",
                output: null, // will be replaced
            };
            setLines((prev) => [...prev, thinkingEntry]);
            setIsThinking(true);

            try {
                const response = await askAI(userMessage);

                // Track remaining AI credits
                if (response.remaining !== undefined) {
                    setAiCredits(response.remaining);
                }

                // Auto-open URL if AI returned one
                if (response.openUrl) {
                    window.open(response.openUrl, "_blank");
                }

                setLines((prev) =>
                    prev.map((line) =>
                        line.id === thinkingId
                            ? {
                                ...line,
                                output: (
                                    <AIBubble
                                        message={response.message}
                                        equivalentCmd={response.equivalentCmd}
                                        openUrl={response.openUrl}
                                        onRunCommand={(cmd) => {
                                            runCliCommand(cmd);
                                            setCmdHistory((h) => [...h, cmd]);
                                        }}
                                    />
                                ),
                            }
                            : line
                    )
                );
            } catch {
                setLines((prev) =>
                    prev.map((line) =>
                        line.id === thinkingId
                            ? {
                                ...line,
                                output: (
                                    <div
                                        style={{
                                            borderLeft: `3px solid ${COLORS.accentRed}`,
                                            background: COLORS.aiBubbleBg,
                                            borderRadius: "0 6px 6px 0",
                                            padding: "12px 16px",
                                            margin: "8px 0",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                            <span style={{ color: COLORS.accentRed, fontSize: 14 }}>✦</span>
                                            <span style={{ color: COLORS.accentRed, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>Error</span>
                                        </div>
                                        <div style={{ color: COLORS.cmdText, fontSize: 13, paddingLeft: 22 }}>
                                            Couldn&apos;t connect to the AI layer. Try a direct command instead.
                                        </div>
                                        <div style={{ color: COLORS.outputText, marginTop: 4, fontSize: 12, paddingLeft: 22 }}>
                                            Type &apos;help&apos; to see all available commands.
                                        </div>
                                    </div>
                                ),
                            }
                            : line
                    )
                );
            } finally {
                setIsThinking(false);
            }
        },
        [runCliCommand]
    );

    // ─── Autocomplete helpers ───
    const acMatches = getFilteredCommands(input);

    // ─── Handle submit ───
    const handleSubmit = useCallback(() => {
        // If dropdown has a highlighted item, execute that command
        if (acMatches.length > 0 && acIdx >= 0) {
            const selectedCmd = acMatches[acIdx]?.cmd ?? "";
            if (selectedCmd) {
                setInput("");
                setAcIdx(-1);
                setCmdHistory((prev) => [...prev, selectedCmd]);
                setHistIdx(-1);
                const mode = classifyInput(selectedCmd);
                if (mode === "cli") {
                    runCliCommand(selectedCmd);
                } else {
                    void runAIQuery(selectedCmd);
                }
                return;
            }
        }

        const trimmed = input.trim();
        if (!trimmed || trimmed === "/") return;

        setCmdHistory((prev) => [...prev, trimmed]);
        setHistIdx(-1);
        setInput("");
        setAcIdx(-1);

        const mode = classifyInput(trimmed);

        if (mode === "cli") {
            runCliCommand(trimmed);
        } else {
            void runAIQuery(trimmed);
        }
    }, [input, acMatches, acIdx, runCliCommand, runAIQuery]);

    // ─── History navigation ───
    const handleArrowUp = useCallback(() => {
        if (cmdHistory.length === 0) return;
        const newIdx = histIdx === -1 ? cmdHistory.length - 1 : Math.max(0, histIdx - 1);
        setHistIdx(newIdx);
        setInput(cmdHistory[newIdx] ?? "");
    }, [cmdHistory, histIdx]);

    const handleArrowDown = useCallback(() => {
        if (histIdx === -1) return;
        const newIdx = histIdx + 1;
        if (newIdx >= cmdHistory.length) {
            setHistIdx(-1);
            setInput("");
        } else {
            setHistIdx(newIdx);
            setInput(cmdHistory[newIdx] ?? "");
        }
    }, [cmdHistory, histIdx]);


    const selectAutocomplete = useCallback((cmd: string) => {
        setInput(cmd);
        setAcIdx(-1);
        inputRef.current?.focus();
    }, []);

    // Reset dropdown index when input changes
    useEffect(() => {
        setAcIdx(-1);
    }, [input]);

    // ─── Tab autocomplete ───
    const handleTab = useCallback(() => {
        // If dropdown is open and an item is highlighted, select it
        if (acMatches.length > 0 && acIdx >= 0) {
            setInput(acMatches[acIdx]?.cmd ?? "");
            setAcIdx(-1);
            return;
        }

        // If dropdown has matches, select first one
        if (acMatches.length > 0) {
            setInput(acMatches[0]?.cmd ?? "");
            setAcIdx(-1);
            return;
        }
    }, [input, acMatches, acIdx]);

    // ─── Click to focus ───
    const handleTerminalClick = useCallback(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div
            onClick={handleTerminalClick}
            style={{
                width: "100%",
                maxWidth: 960,
                height: "100%",
                background: COLORS.terminalBg,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                borderLeft: `1px solid ${COLORS.border}`,
                borderRight: `1px solid ${COLORS.border}`,
            }}
        >
            <TitleBar />

            {/* Output area */}
            <div
                ref={scrollRef}
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "12px 20px",
                }}
            >
                {/* Boot sequence */}
                {!bootDone && <BootSequence onComplete={() => setBootDone(true)} />}

                {/* Interactive welcome guide — shows after boot, until dismissed */}
                {bootDone && !guideDone && lines.length === 0 && (
                    <WelcomeGuide onComplete={() => setGuideDone(true)} />
                )}

                {/* Static prompt hint — after guide done, until first command */}
                {bootDone && guideDone && lines.length === 0 && (
                    <div style={{ padding: "16px 0", animation: "fadeIn 0.4s ease-out" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                            <span style={{ color: COLORS.promptChevron, fontSize: 14 }}>❯</span>
                            <span style={{ color: COLORS.muted, fontSize: 13 }}>
                                Type{" "}
                                <span style={{ color: COLORS.accentGreen, fontWeight: 700 }}>help</span>
                                {" "}or write a prompt to get started…
                            </span>
                            <span
                                style={{
                                    display: "inline-block",
                                    width: 8,
                                    height: 16,
                                    background: COLORS.accentOrange,
                                    animation: "blink 1s step-end infinite",
                                    marginLeft: -4,
                                }}
                            />
                        </div>
                        {/* Sample prompts */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingLeft: 24 }}>
                            {[
                                { label: "skills", icon: "⚡" },
                                { label: "projects", icon: "📂" },
                                { label: "whoami", icon: "👤" },
                                { label: "tell me about Suraj", icon: "🤖" },
                                { label: "curl resume.pdf", icon: "📄" },
                            ].map(({ label, icon }) => (
                                <span
                                    key={label}
                                    onClick={() => {
                                        setInput(label);
                                        setTimeout(() => handleSubmit(), 50);
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    style={{
                                        color: COLORS.cmdText,
                                        fontSize: 12,
                                        cursor: "pointer",
                                        padding: "5px 12px",
                                        background: COLORS.headerBg,
                                        border: `1px solid ${COLORS.border}`,
                                        borderRadius: 16,
                                        transition: "all 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = COLORS.accentOrange;
                                        e.currentTarget.style.background = `${COLORS.accentOrange}15`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = COLORS.border;
                                        e.currentTarget.style.background = COLORS.headerBg;
                                    }}
                                >
                                    {icon} {label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Historical lines */}
                {bootDone &&
                    lines.map((line) => (
                        <div key={line.id} style={{ marginBottom: 4 }}>
                            <PromptLine cmd={line.cmd} />
                            {line.output === null && isThinking && line.id === lines[lines.length - 1]?.id ? (
                                <ThinkingIndicator />
                            ) : (
                                line.output
                            )}
                        </div>
                    ))}

                {/* Thinking indicator for the latest AI query */}
                {isThinking && lines.length > 0 && lines[lines.length - 1]?.output !== null && (
                    <ThinkingIndicator />
                )}
            </div>

            {/* Input row + Autocomplete */}
            {bootDone && (
                <div style={{ position: "relative", padding: "8px 20px 12px", borderTop: `1px solid ${COLORS.border}` }}>
                    {/* Autocomplete dropdown */}
                    <AutocompleteDropdown
                        input={input}
                        selectedIndex={acIdx}
                        onSelect={selectAutocomplete}
                    />
                    <InputRow
                        value={input}
                        onChange={setInput}
                        onSubmit={handleSubmit}
                        onArrowUp={() => {
                            if (acMatches.length > 0) {
                                setAcIdx((prev) => (prev <= 0 ? 0 : prev - 1));
                            } else {
                                handleArrowUp();
                            }
                        }}
                        onArrowDown={() => {
                            if (acMatches.length > 0) {
                                setAcIdx((prev) => (prev >= acMatches.length - 1 ? acMatches.length - 1 : prev + 1));
                            } else {
                                handleArrowDown();
                            }
                        }}
                        onTab={handleTab}
                        inputRef={inputRef}
                        disabled={isThinking}
                    />
                </div>
            )}

            {/* AI Disclaimer + Credits */}
            <div
                style={{
                    padding: "5px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 11,
                    color: "#f8a0a0",
                    borderTop: `1px solid ${COLORS.border}`,
                }}
            >
                <span>
                    ⚠ AI can make mistakes. Use / for commands suggestions or type{" "}
                    <span
                        onClick={() => {
                            setInput("help");
                            handleSubmit();
                        }}
                        role="button"
                        tabIndex={0}
                        style={{
                            color: COLORS.accentGreen,
                            fontWeight: 700,
                            background: `${COLORS.accentGreen}15`,
                            border: `1px solid ${COLORS.accentGreen}40`,
                            borderRadius: 3,
                            padding: "1px 8px",
                            cursor: "pointer",
                        }}
                    >
                        help
                    </span>{" "}
                    for better accuracy.
                </span>
                <span
                    style={{
                        color: aiCredits <= 1 ? COLORS.accentRed : aiCredits <= 3 ? COLORS.accentOrange : COLORS.accentGreen,
                        fontWeight: 700,
                        fontSize: 10,
                        whiteSpace: "nowrap",
                        marginLeft: 12,
                    }}
                >
                    🤖 {aiCredits}/5 AI prompts left today
                </span>
            </div>

            {/* Status bar */}
            <div
                style={{
                    background: COLORS.statusBar,
                    padding: "6px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: `1px solid ${COLORS.border}`,
                    fontSize: 11,
                    userSelect: "none",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: COLORS.accentOrange }}>✦</span>
                    <span style={{ color: COLORS.muted }}>portfolio-mode</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ color: COLORS.muted }}>suraj</span>
                    <span style={{ color: COLORS.border }}>·</span>
                    <span style={{ color: COLORS.muted }}>New Delhi</span>
                    <span style={{ color: COLORS.border }}>·</span>
                    <span style={{ color: COLORS.accentGreen, fontSize: 10 }}>● open to work</span>
                </div>
            </div>
        </div>
    );
}
