import { useState } from "react";
import { COLORS } from "../theme";

interface Step {
    emoji: string;
    title: string;
    description: string;
    example?: string;
    highlight: string;
}

const STEPS: Step[] = [
    {
        emoji: "👋",
        title: "Welcome to Suraj's Terminal!",
        description: "This is an interactive portfolio. You can explore everything about Suraj by typing commands — just like a real terminal!",
        highlight: "Let's take a quick tour →",
    },
    {
        emoji: "⌨️",
        title: "Type Commands",
        description: "Click anywhere and start typing. Try these commands to explore:",
        example: "help · skills · projects · experience",
        highlight: "They work just like a real CLI!",
    },
    {
        emoji: "🤖",
        title: "Ask AI Anything",
        description: "Not sure what to type? Just ask in plain English! The AI assistant knows everything about Suraj.",
        example: "\"tell me about this person\" · \"what does he know?\"",
        highlight: "AI will answer + suggest the right command!",
    },
    {
        emoji: "📄",
        title: "Get Resume & Socials",
        description: "Ask for resume, LinkedIn, or GitHub — they'll open automatically in a new tab!",
        example: "\"give me his resume\" · \"show me GitHub\"",
        highlight: "Links open instantly!",
    },
    {
        emoji: "🎯",
        title: "Pro Tips",
        description: "Use ↑↓ arrows to browse command history. Press Tab to autocomplete commands. Try the easter egg: sudo hire-me 😄",
        highlight: "You're all set! Let's go →",
    },
];

interface WelcomeGuideProps {
    onComplete: () => void;
}

export function WelcomeGuide({ onComplete }: WelcomeGuideProps): JSX.Element {
    const [currentStep, setCurrentStep] = useState(0);
    const step = STEPS[currentStep]!;
    const isLast = currentStep === STEPS.length - 1;

    const goNext = () => {
        if (isLast) {
            onComplete();
        } else {
            setCurrentStep((s) => s + 1);
        }
    };

    const goBack = () => {
        if (currentStep > 0) {
            setCurrentStep((s) => s - 1);
        }
    };

    return (
        <div style={{ padding: "12px 0", animation: "fadeIn 0.3s ease-out" }}>
            {/* Card */}
            <div
                style={{
                    background: COLORS.headerBg,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 10,
                    padding: "24px 24px 18px",
                    maxWidth: 520,
                }}
            >
                {/* Emoji + Title */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <span
                        style={{
                            fontSize: 36,
                            lineHeight: 1,
                            animation: currentStep === 0 ? "pulse 2s infinite" : undefined,
                        }}
                    >
                        {step.emoji}
                    </span>
                    <div>
                        <div style={{ color: COLORS.cmdText, fontWeight: 700, fontSize: 15 }}>
                            {step.title}
                        </div>
                        <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>
                            Step {currentStep + 1} of {STEPS.length}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div style={{ color: COLORS.outputText, fontSize: 13, lineHeight: 1.7, marginBottom: 10 }}>
                    {step.description}
                </div>

                {/* Example code block */}
                {step.example && (
                    <div
                        style={{
                            background: COLORS.terminalBg,
                            border: `1px solid ${COLORS.border}`,
                            borderRadius: 6,
                            padding: "8px 14px",
                            marginBottom: 10,
                            color: COLORS.accentGreen,
                            fontSize: 12,
                            fontFamily: "'JetBrains Mono', monospace",
                        }}
                    >
                        <span style={{ color: COLORS.promptChevron, marginRight: 8 }}>❯</span>
                        {step.example}
                    </div>
                )}

                {/* Highlight text */}
                <div style={{ color: COLORS.accentOrange, fontSize: 12, fontWeight: 700, marginBottom: 16 }}>
                    {step.highlight}
                </div>

                {/* Navigation */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {/* Progress dots */}
                    <div style={{ display: "flex", gap: 6 }}>
                        {STEPS.map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    width: i === currentStep ? 20 : 8,
                                    height: 8,
                                    borderRadius: 4,
                                    background: i === currentStep ? COLORS.accentOrange : COLORS.border,
                                    transition: "all 0.3s ease",
                                }}
                            />
                        ))}
                    </div>

                    {/* Buttons */}
                    <div style={{ display: "flex", gap: 8 }}>
                        {/* Skip link */}
                        <span
                            onClick={onComplete}
                            role="button"
                            tabIndex={0}
                            style={{
                                color: COLORS.muted,
                                fontSize: 11,
                                cursor: "pointer",
                                padding: "6px 10px",
                                borderRadius: 4,
                            }}
                        >
                            Skip
                        </span>

                        {/* Back button */}
                        {currentStep > 0 && (
                            <span
                                onClick={goBack}
                                role="button"
                                tabIndex={0}
                                style={{
                                    color: COLORS.outputText,
                                    fontSize: 12,
                                    cursor: "pointer",
                                    padding: "6px 12px",
                                    border: `1px solid ${COLORS.border}`,
                                    borderRadius: 6,
                                }}
                            >
                                ← Back
                            </span>
                        )}

                        {/* Next / Start button */}
                        <span
                            onClick={goNext}
                            role="button"
                            tabIndex={0}
                            style={{
                                color: "#fff",
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: "pointer",
                                padding: "6px 16px",
                                background: COLORS.accentOrange,
                                borderRadius: 6,
                            }}
                        >
                            {isLast ? "Start Exploring! 🚀" : "Next →"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
