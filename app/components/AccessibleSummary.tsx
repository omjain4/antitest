import { HUD_PHASES } from "@/data/transformerData";

export default function AccessibleSummary() {
    return (
        <div className="sr-only" role="region" aria-label="Sequence description">
            <h2>Pariney Saree — Cinematic Showcase</h2>
            <p>
                A 144-frame cinematic scroll-driven sequence showcasing the Pariney Saree
                collection. A woman draped in a handwoven Banarasi saree rotates gracefully
                while master artisans craft the fabric in the background, surrounded by
                vibrant flowing sarees in rich reds, golds, purples, and teals.
            </p>
            <h3>Sequence Phases</h3>
            <ol>
                {HUD_PHASES.map((phase) => (
                    <li key={phase.id}>
                        <strong>{phase.label}</strong> ({Math.round(phase.start * 100)}%–
                        {Math.round(Math.min(phase.end, 1) * 100)}%):{" "}
                        {phase.lines.map((l) => l.text).join(" · ")}
                    </li>
                ))}
            </ol>
        </div>
    );
}
