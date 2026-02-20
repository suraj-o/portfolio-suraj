import { useEffect, useRef } from "react";
import { COLORS } from "../theme";

// ─── Full command list with accurate subcommands ───
export interface CmdEntry {
    cmd: string;
    icon: string;
    desc: string;
}

export const ALL_COMMANDS: CmdEntry[] = [
    { cmd: "help", icon: "📋", desc: "Show all available commands" },
    { cmd: "whoami", icon: "👤", desc: "Display profile summary" },
    { cmd: "skills", icon: "⚡", desc: "Technical skills by category" },
    { cmd: "experience", icon: "💼", desc: "Work experience timeline" },
    { cmd: "experience --short", icon: "💼", desc: "Condensed experience view" },
    { cmd: "projects", icon: "📂", desc: "Featured project portfolio" },
    { cmd: "projects --ls", icon: "📂", desc: "List project names only" },
    { cmd: "education", icon: "🎓", desc: "Education background" },
    { cmd: "certifications", icon: "📜", desc: "Certifications & courses" },
    { cmd: "contact", icon: "📧", desc: "Contact information" },
    { cmd: "neofetch", icon: "🖥️", desc: "System summary card" },
    { cmd: "clear", icon: "🧹", desc: "Clear the terminal" },
    { cmd: "history", icon: "📝", desc: "Show command history" },
    { cmd: "ls", icon: "📁", desc: "List available sections" },
    { cmd: "cat about.txt", icon: "🐱", desc: "Read profile summary" },
    { cmd: "cat skills.json", icon: "🐱", desc: "Read skills data" },
    { cmd: "cat experience.md", icon: "🐱", desc: "Read experience file" },
    { cmd: "cat contact.txt", icon: "🐱", desc: "Read contact info" },
    { cmd: "cat certifications.txt", icon: "🐱", desc: "Read certifications" },
    { cmd: "pwd", icon: "📍", desc: "Print working directory" },
    { cmd: "date", icon: "📅", desc: "Current date & time" },
    { cmd: "uname -a", icon: "💻", desc: "System information" },
    { cmd: "echo hello", icon: "🔊", desc: "Echo text back" },
    { cmd: "sudo hire-me", icon: "🔒", desc: "🤫 Easter egg" },
    { cmd: "curl resume.pdf", icon: "📄", desc: "Open resume in new tab" },
];

export function getFilteredCommands(input: string): CmdEntry[] {
    const trimmed = input.trim().toLowerCase();
    if (trimmed === "/") return ALL_COMMANDS;
    if (!trimmed) return [];
    return ALL_COMMANDS.filter(
        (entry) => entry.cmd.startsWith(trimmed) && entry.cmd !== trimmed
    );
}

interface AutocompleteDropdownProps {
    input: string;
    selectedIndex: number;
    onSelect: (cmd: string) => void;
}

export function AutocompleteDropdown({
    input,
    selectedIndex,
    onSelect,
}: AutocompleteDropdownProps): JSX.Element | null {
    const listRef = useRef<HTMLDivElement | null>(null);
    const matches = getFilteredCommands(input);

    // Auto-scroll selected item into view
    useEffect(() => {
        if (selectedIndex < 0 || !listRef.current) return;
        const items = listRef.current.querySelectorAll("[data-ac-item]");
        const target = items[selectedIndex] as HTMLElement | undefined;
        target?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, [selectedIndex]);

    if (matches.length === 0) return null;

    const trimmed = input.trim().toLowerCase();
    const showAll = trimmed === "/";

    return (
        <div
            ref={listRef}
            style={{
                position: "absolute",
                bottom: "100%",
                left: 0,
                right: 0,
                marginBottom: 4,
                background: COLORS.headerBg,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 8,
                padding: "0 0 6px",
                maxHeight: 240,
                overflowY: "auto",
                zIndex: 100,
                boxShadow: "0 -4px 20px rgba(0,0,0,0.4)",
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: "4px 14px 8px",
                    fontSize: 10,
                    color: COLORS.muted,
                    borderBottom: `1px solid ${COLORS.border}`,
                    marginBottom: 4,
                    position: "sticky",
                    top: 0,
                    background: COLORS.headerBg,
                    zIndex: 1,
                }}
            >
                {showAll ? "All commands" : `Matching "${trimmed}"`} · Tab to complete · ↑↓ to navigate
            </div>

            {/* Command list */}
            {matches.map((entry, i) => {
                const isActive = i === selectedIndex;
                return (
                    <div
                        key={entry.cmd}
                        data-ac-item
                        onClick={() => onSelect(entry.cmd)}
                        role="option"
                        aria-selected={isActive}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "7px 14px",
                            cursor: "pointer",
                            background: isActive ? `${COLORS.accentOrange}18` : "transparent",
                            borderLeft: isActive ? `2px solid ${COLORS.accentOrange}` : "2px solid transparent",
                            transition: "background 0.1s ease",
                        }}
                        onMouseEnter={(e) => {
                            if (!isActive) e.currentTarget.style.background = `${COLORS.accentOrange}10`;
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive) e.currentTarget.style.background = "transparent";
                        }}
                    >
                        <span style={{ fontSize: 14, width: 20, textAlign: "center" }}>
                            {entry.icon}
                        </span>
                        <span style={{ color: COLORS.accentGreen, fontWeight: 700, fontSize: 13, minWidth: 160 }}>
                            {entry.cmd}
                        </span>
                        <span style={{ color: COLORS.muted, fontSize: 11 }}>
                            {entry.desc}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
