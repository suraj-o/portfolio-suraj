import type { InputMode } from "./types";

const CLI_COMMANDS: readonly string[] = [
    "help", "whoami", "skills", "experience", "projects",
    "education", "certifications", "contact", "neofetch",
    "ls", "cat", "pwd", "date", "uname", "echo",
    "history", "clear", "sudo", "curl",
    // Common Unix commands (handled gracefully)
    "cd", "mkdir", "rm", "mv", "cp", "touch",
    "vim", "nano", "chmod", "grep", "man",
    "apt", "pip", "npm", "git", "ssh", "wget",
] as const;

const NL_INDICATORS: readonly string[] = [
    "tell", "show", "what", "who", "where", "how",
    "give", "list", "explain", "describe", "his", "your",
    "does", "did", "has", "have", "is", "are", "can",
] as const;

export function classifyInput(input: string): InputMode {
    const trimmed = input.trim().toLowerCase();
    const words = trimmed.split(/\s+/);
    const firstWord = words[0] ?? "";

    // Exact or starts-with match against known CLI commands
    if (CLI_COMMANDS.includes(firstWord)) return "cli";

    // If it contains natural language indicators → AI
    if (NL_INDICATORS.some((w) => words.includes(w))) return "ai";

    // Anything with spaces that isn't a known command → AI
    if (trimmed.includes(" ") && !CLI_COMMANDS.includes(firstWord)) return "ai";

    // Default to CLI for single unknown words (shows "command not found")
    return "cli";
}

export function getCliCommands(): readonly string[] {
    return CLI_COMMANDS;
}
