import type { ReactNode } from "react";
import type { PortfolioData } from "./types";
import { COLORS } from "./theme";


// ─── Helper to create styled spans ───
function span(text: string, color: string, extra?: React.CSSProperties): ReactNode {
    return <span style={{ color, ...extra }}>{text}</span>;
}

// ─── HELP ───
export function renderHelp(): ReactNode {
    const commands: Array<[string, string]> = [
        ["help", "Show this help menu"],
        ["whoami", "Display profile summary"],
        ["skills", "List technical skills by category"],
        ["experience", "Show work experience timeline"],
        ["experience --short", "Condensed experience view"],
        ["projects", "Show project portfolio"],
        ["projects --ls", "List project names only"],
        ["education", "Show education details"],
        ["certifications", "List certifications"],
        ["contact", "Display contact information"],
        ["neofetch", "System info (portfolio style)"],
        ["ls", "List available files"],
        ["cat <file>", "Read a file"],
        ["pwd", "Print working directory"],
        ["date", "Show current date"],
        ["uname -a", "Show system information"],
        ["echo <text>", "Print text"],
        ["history", "Show command history"],
        ["clear", "Clear the terminal"],
        ["sudo hire-me", "🤫 Easter egg"],
        ["curl resume.pdf", "Get resume link"],
    ];

    return (
        <div style={{ padding: "8px 0" }}>
            {commands.map(([cmd, desc], i) => (
                <div key={i} style={{ display: "flex", gap: 16, lineHeight: 1.8 }}>
                    <span style={{ color: COLORS.accentGreen, minWidth: 220, fontWeight: 700 }}>{cmd}</span>
                    <span style={{ color: COLORS.outputText }}>{desc}</span>
                </div>
            ))}
            <div style={{ color: COLORS.outputText, marginTop: 12, fontStyle: "italic" }}>
                Tip: Use ↑↓ for history · Tab to autocomplete · Or just ask me anything!
            </div>
        </div>
    );
}

// ─── WHOAMI ───
export function renderWhoami(data: PortfolioData): ReactNode {
    const ascii = [
        "███████╗██╗   ██╗██████╗  █████╗      ██╗",
        "██╔════╝██║   ██║██╔══██╗██╔══██╗     ██║",
        "███████╗██║   ██║██████╔╝███████║     ██║",
        "╚════██║██║   ██║██╔══██╗██╔══██║██   ██║",
        "███████║╚██████╔╝██║  ██║██║  ██║╚█████╔╝",
        "╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚════╝ ",
    ];

    return (
        <div style={{ padding: "8px 0" }}>
            <pre style={{ color: COLORS.accentOrange, fontSize: 11, lineHeight: 1.2, margin: 0 }}>
                {ascii.join("\n")}
            </pre>
            <p style={{ color: COLORS.outputText, marginTop: 12, lineHeight: 1.7 }}>{data.summary}</p>
        </div>
    );
}

// ─── SKILLS ───
export function renderSkills(data: PortfolioData): ReactNode {
    return (
        <div style={{ padding: "8px 0" }}>
            {(Object.entries(data.skills) as Array<[string, string[]]>).map(([category, items]) => (
                <div key={category} style={{ marginBottom: 12 }}>
                    <div style={{ color: COLORS.accentOrange, fontWeight: 700, marginBottom: 6 }}>
                        ▸ {category}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {items.map((skill) => (
                            <span
                                key={skill}
                                style={{
                                    color: COLORS.tagText,
                                    background: COLORS.tagBg,
                                    border: `1px solid ${COLORS.tagBorder}`,
                                    borderRadius: 4,
                                    padding: "2px 10px",
                                    fontSize: 12,
                                }}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── EXPERIENCE ───
export function renderExperience(data: PortfolioData, short: boolean): ReactNode {
    if (short) {
        return (
            <div style={{ padding: "8px 0" }}>
                {data.experience.map((exp) => (
                    <div key={exp.company} style={{ color: COLORS.outputText, lineHeight: 1.8 }}>
                        {span(exp.company, COLORS.accentOrange, { fontWeight: 700 })} — {exp.role}{" "}
                        <span style={{ color: COLORS.muted }}>[{exp.period}]</span>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div style={{ padding: "8px 0" }}>
            {data.experience.map((exp) => (
                <div key={exp.company} style={{ marginBottom: 16 }}>
                    <div style={{ color: COLORS.accentOrange, fontWeight: 700, fontSize: 14 }}>
                        {exp.company}
                    </div>
                    <div style={{ color: COLORS.cmdText }}>
                        {exp.role}
                    </div>
                    <div style={{ color: COLORS.outputText, fontSize: 12 }}>
                        {exp.period} · {exp.location}
                    </div>
                    <div style={{ marginTop: 6 }}>
                        {exp.highlights.map((h, i) => (
                            <div key={i} style={{ color: COLORS.outputText, lineHeight: 1.7, paddingLeft: 16 }}>
                                {span("▹ ", COLORS.accentGreen)}{h}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── PROJECTS ───
export function renderProjects(data: PortfolioData, listOnly: boolean): ReactNode {
    if (listOnly) {
        return (
            <div style={{ padding: "8px 0" }}>
                {data.projects.map((p) => (
                    <div key={p.name} style={{ color: COLORS.accentPurple, lineHeight: 1.8 }}>
                        ◆ {p.name}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div style={{ padding: "8px 0" }}>
            {data.projects.map((p) => (
                <div key={p.name} style={{ marginBottom: 16 }}>
                    <div style={{ color: COLORS.accentPurple, fontWeight: 700, fontSize: 14 }}>
                        {p.name}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "6px 0" }}>
                        {p.tech.map((t) => (
                            <span
                                key={t}
                                style={{
                                    color: COLORS.accentOrange,
                                    background: COLORS.tagBg,
                                    border: `1px solid ${COLORS.tagBorder}`,
                                    borderRadius: 4,
                                    padding: "2px 8px",
                                    fontSize: 11,
                                }}
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                    {p.highlights.map((h, i) => (
                        <div key={i} style={{ color: COLORS.outputText, lineHeight: 1.7, paddingLeft: 16 }}>
                            {span("▹ ", COLORS.accentGreen)}{h}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

// ─── EDUCATION ───
export function renderEducation(data: PortfolioData): ReactNode {
    return (
        <div style={{ padding: "8px 0" }}>
            <div style={{ color: COLORS.accentOrange, fontWeight: 700 }}>{data.education.degree}</div>
            <div style={{ color: COLORS.cmdText }}>{data.education.institution}</div>
            <div style={{ color: COLORS.outputText, fontSize: 12 }}>
                {data.education.location} · {data.education.period}
            </div>
        </div>
    );
}

// ─── CERTIFICATIONS ───
export function renderCertifications(data: PortfolioData): ReactNode {
    return (
        <div style={{ padding: "8px 0" }}>
            {data.certifications.map((cert) => (
                <div key={cert} style={{ color: COLORS.outputText, lineHeight: 1.8 }}>
                    {span("✓ ", COLORS.accentGreen)}{cert}
                </div>
            ))}
        </div>
    );
}

// ─── CONTACT ───
export function renderContact(data: PortfolioData): ReactNode {
    const rows: Array<[string, string, string]> = [
        ["📧", "Email", data.personal.email],
        ["📱", "Phone", data.personal.phone],
        ["💼", "LinkedIn", data.personal.linkedin],
        ["🐙", "GitHub", data.personal.github],
        ["📍", "Location", data.personal.location],
    ];

    return (
        <div style={{ padding: "8px 0" }}>
            {rows.map(([icon, label, value]) => (
                <div key={label} style={{ display: "flex", gap: 12, lineHeight: 2 }}>
                    <span style={{ minWidth: 24 }}>{icon}</span>
                    <span style={{ color: COLORS.outputText, minWidth: 80 }}>{label}</span>
                    <span
                        style={{
                            color: label === "Email" || label === "LinkedIn" || label === "GitHub"
                                ? COLORS.accentCyan
                                : COLORS.cmdText,
                            textDecoration:
                                label === "Email" || label === "LinkedIn" || label === "GitHub"
                                    ? "underline"
                                    : "none",
                        }}
                    >
                        {value}
                    </span>
                </div>
            ))}
        </div>
    );
}

// ─── NEOFETCH ───
export function renderNeofetch(): ReactNode {
    const ascii = [
        "   _____  ",
        "  / ____|  ",
        " | (___   ",
        "  \\___ \\  ",
        "  ____) |  ",
        " |_____/   ",
    ];

    const info: Array<[string, string]> = [
        ["OS", "Suraj OS v1.0 (Debian-based)"],
        ["Host", "portfolio.suraj.dev"],
        ["Kernel", "creativity 5.15.0-generic"],
        ["Uptime", "2 years, shipping in prod"],
        ["Shell", "/bin/typescript"],
        ["Role", "Full-Stack Software Engineer"],
        ["Stack", "Node.js · React · AWS · Docker"],
        ["Location", "New Delhi, India"],
        ["Status", "✓ Open to opportunities"],
    ];

    return (
        <div style={{ display: "flex", gap: 32, padding: "8px 0", alignItems: "flex-start" }}>
            <pre style={{ color: COLORS.accentGreen, fontSize: 12, lineHeight: 1.3, margin: 0 }}>
                {ascii.join("\n")}
            </pre>
            <div>
                {info.map(([key, val]) => (
                    <div key={key} style={{ lineHeight: 1.8 }}>
                        <span style={{ color: COLORS.accentOrange, minWidth: 90, display: "inline-block" }}>
                            {key}
                        </span>
                        <span style={{ color: COLORS.outputText }}> : </span>
                        <span style={{ color: key === "Status" ? COLORS.accentGreen : COLORS.cmdText }}>
                            {val}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── LS ───
export function renderLs(): ReactNode {
    const files: Array<[string, string]> = [
        ["about.txt", COLORS.cmdText],
        ["skills.json", COLORS.accentGreen],
        ["experience.md", COLORS.accentOrange],
        ["projects/", COLORS.accentCyan],
        ["contact.txt", COLORS.cmdText],
        ["certifications.txt", COLORS.cmdText],
    ];

    return (
        <div style={{ display: "flex", gap: 20, padding: "8px 0", flexWrap: "wrap" }}>
            {files.map(([name, color]) => (
                <span key={name} style={{ color, fontWeight: name.endsWith("/") ? 700 : 400 }}>
                    {name}
                </span>
            ))}
        </div>
    );
}

// ─── SUDO HIRE-ME ───
export function renderSudoHireMe(data: PortfolioData): ReactNode {
    return (
        <div
            style={{
                border: `1px solid ${COLORS.accentGreen}`,
                borderRadius: 6,
                padding: "12px 16px",
                margin: "8px 0",
            }}
        >
            <div style={{ color: COLORS.accentGreen, fontWeight: 700 }}>✓ sudo: privilege granted</div>
            <div style={{ marginTop: 8, lineHeight: 1.8 }}>
                <div style={{ color: COLORS.cmdText }}>→ Candidate : {data.personal.name}</div>
                <div style={{ color: COLORS.cmdText }}>→ Stack     : Full-Stack + DevOps + AI</div>
                <div style={{ color: COLORS.accentGreen }}>→ Status    : AVAILABLE</div>
                <div style={{ color: COLORS.cmdText }}>→ Email     : {data.personal.email}</div>
                <div style={{ color: COLORS.cmdText }}>→ GitHub    : {data.personal.github}</div>
            </div>
            <div style={{ color: COLORS.outputText, marginTop: 8, fontStyle: "italic" }}>
                No sudo password required to hire great engineers. 😄
            </div>
        </div>
    );
}

// ─── Master command processor ───
export function processCommand(
    cmd: string,
    data: PortfolioData | null,
    history: string[]
): ReactNode {
    const trimmed = cmd.trim();
    const lower = trimmed.toLowerCase();
    const parts = lower.split(/\s+/);
    const firstWord = parts[0] ?? "";

    if (!data) {
        return span("Loading portfolio data...", COLORS.outputText);
    }

    switch (firstWord) {
        case "help":
            return renderHelp();

        case "whoami":
            return renderWhoami(data);

        case "skills":
            return renderSkills(data);

        case "experience":
            return renderExperience(data, parts.includes("--short"));

        case "projects":
            return renderProjects(data, parts.includes("--ls"));

        case "education":
            return renderEducation(data);

        case "certifications":
            return renderCertifications(data);

        case "contact":
            return renderContact(data);

        case "neofetch":
            return renderNeofetch();

        case "ls":
            return renderLs();

        case "cat": {
            const filename = parts[1] ?? "";
            const fileMap: Record<string, () => ReactNode> = {
                "about.txt": () => renderWhoami(data),
                "skills.json": () => renderSkills(data),
                "experience.md": () => renderExperience(data, false),
                "contact.txt": () => renderContact(data),
                "certifications.txt": () => renderCertifications(data),
            };

            if (filename === "projects/" || filename === "projects") {
                return span("cat: projects/: Is a directory. Try: projects", COLORS.accentRed);
            }

            const handler = fileMap[filename];
            if (handler) return handler();

            if (!filename) {
                return span("cat: missing file operand", COLORS.accentRed);
            }

            // Fuzzy match: check if basename matches a known file
            const baseName = filename.split(".")[0] ?? "";
            const knownFiles = Object.keys(fileMap);
            const suggestion = knownFiles.find((f) => f.startsWith(baseName + "."));
            if (suggestion) {
                return (
                    <div>
                        <div style={{ color: COLORS.accentRed }}>
                            cat: {filename}: No such file or directory
                        </div>
                        <div style={{ color: COLORS.outputText }}>
                            💡 Did you mean: <span style={{ color: COLORS.accentGreen, fontWeight: 700 }}>cat {suggestion}</span>?
                        </div>
                    </div>
                );
            }

            return (
                <div>
                    <div style={{ color: COLORS.accentRed }}>
                        cat: {filename}: No such file or directory
                    </div>
                    <div style={{ color: COLORS.outputText }}>
                        📁 Available files: {knownFiles.join(", ")} — Try <span style={{ color: COLORS.accentGreen, fontWeight: 700 }}>ls</span>
                    </div>
                </div>
            );
        }

        case "pwd":
            return span("/home/suraj/portfolio", COLORS.cmdText);

        case "date":
            return span(new Date().toString(), COLORS.cmdText);

        case "uname":
            return span("Linux suraj-portfolio 5.15.0-generic #1 SMP x86_64 GNU/Linux", COLORS.cmdText);

        case "echo":
            return span(trimmed.slice(5), COLORS.cmdText);

        case "history":
            return (
                <div style={{ padding: "4px 0" }}>
                    {history.map((h, i) => (
                        <div key={i} style={{ color: COLORS.outputText, lineHeight: 1.8 }}>
                            <span style={{ color: COLORS.muted, marginRight: 12 }}>
                                {String(i + 1).padStart(4, " ")}
                            </span>
                            {h}
                        </div>
                    ))}
                </div>
            );

        case "clear":
            return null; // handled by Terminal component

        case "sudo":
            if (parts[1] === "hire-me") {
                return renderSudoHireMe(data);
            }
            return span(`sudo: ${parts.slice(1).join(" ")}: command not found`, COLORS.accentRed);

        case "curl":
            if (parts[1] === "resume.pdf") {
                const resumeUrl = "https://drive.google.com/file/d/1SxTOiE5DdYFrcdTkxsL8pTSWEAm7rlNU/view?usp=drivesdk";
                window.open(resumeUrl, "_blank");
                return (
                    <div style={{ color: COLORS.cmdText }}>
                        {span("200 OK", COLORS.accentGreen)} — Resume opened in new tab:{" "}
                        <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: COLORS.accentCyan, textDecoration: "underline" }}
                        >
                            resume.pdf
                        </a>
                    </div>
                );
            }
            return span(`curl: (6) Could not resolve host: ${parts[1] ?? ""}`, COLORS.accentRed);

        case "cd": {
            const target = parts[1] ?? "";
            if (!target) {
                return span("/home/suraj/portfolio", COLORS.cmdText);
            }
            // If they try to cd into a known "file"
            const knownFiles = ["about.txt", "skills.json", "experience.md", "contact.txt", "certifications.txt"];
            if (knownFiles.includes(target)) {
                return (
                    <div>
                        <div style={{ color: COLORS.accentRed }}>
                            bash: cd: {target}: Not a directory
                        </div>
                        <div style={{ color: COLORS.outputText }}>
                            💡 Try: <span style={{ color: COLORS.accentGreen, fontWeight: 700 }}>cat {target}</span> to read it
                        </div>
                    </div>
                );
            }
            if (target === "projects" || target === "projects/") {
                return (
                    <div>
                        <div style={{ color: COLORS.outputText }}>
                            📂 projects/ — Use <span style={{ color: COLORS.accentGreen, fontWeight: 700 }}>projects</span> to view all projects
                        </div>
                    </div>
                );
            }
            return (
                <div>
                    <div style={{ color: COLORS.accentRed }}>
                        bash: cd: {target}: No such directory
                    </div>
                    <div style={{ color: COLORS.outputText }}>
                        📁 Try <span style={{ color: COLORS.accentGreen, fontWeight: 700 }}>ls</span> to see available files
                    </div>
                </div>
            );
        }

        // Common Unix commands — friendly "not available" messages
        case "mkdir":
        case "rm":
        case "mv":
        case "cp":
        case "touch":
        case "chmod":
            return (
                <div>
                    <div style={{ color: COLORS.accentRed }}>
                        bash: {firstWord}: permission denied (read-only filesystem)
                    </div>
                    <div style={{ color: COLORS.outputText }}>
                        🔒 This is a virtual portfolio — no file modifications allowed!
                    </div>
                </div>
            );

        case "vim":
        case "nano":
            return span(`${firstWord}: this portfolio is already perfect, no edits needed 😎`, COLORS.accentOrange);

        case "grep":
            return span("grep: try asking the AI instead! It knows everything about Suraj.", COLORS.outputText);

        case "man":
            return span(`No manual entry for ${parts[1] ?? firstWord}. Try: help`, COLORS.outputText);

        case "git":
            return (
                <div>
                    <div style={{ color: COLORS.cmdText }}>
                        🔗 Check out the real repo:{" "}
                        <a href="https://github.com/surajkumar" target="_blank" rel="noopener noreferrer"
                            style={{ color: COLORS.accentCyan, textDecoration: "underline" }}>
                            github.com/surajkumar
                        </a>
                    </div>
                </div>
            );

        case "ssh":
        case "wget":
        case "apt":
        case "pip":
        case "npm":
            return span(`bash: ${firstWord}: network commands are not available in this terminal`, COLORS.accentRed);

        default:
            return (
                <div>
                    <div style={{ color: COLORS.accentRed }}>
                        bash: {firstWord}: command not found
                    </div>
                    <div style={{ color: COLORS.outputText }}>
                        Type 'help' to see available commands or just ask me anything in plain English!
                    </div>
                </div>
            );
    }
}
