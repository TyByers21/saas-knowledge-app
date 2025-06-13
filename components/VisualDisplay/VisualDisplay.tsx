// components/VisualDisplay/VisualDisplay.tsx
import React, { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { z } from "zod";
import { visualSchema } from "./schemas";
import { ChartRenderer } from "./ChartRenderer";
import { CanvasRenderer } from "./CanvasRenderer";
import { WhiteboardRenderer } from "./WhiteboardRenderer";
import { InlineMath } from "react-katex";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { ErrorBoundary } from "react-error-boundary";
import "katex/dist/katex.min.css";

interface VisualDisplayProps {
    data?: z.infer<typeof visualSchema>;
    subject?: string;
    topic?: string;
}

const VisualDisplay: React.FC<VisualDisplayProps> = ({ data, subject, topic }) => {
    const { conversation } = useStore();
    const [visualBlock, setVisualBlock] = useState<z.infer<typeof visualSchema> | null>(data || null);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (data) {
            setVisualBlock(data);
            timer = setTimeout(() => setVisualBlock(null), 30000); // auto-hide after 30s
            return;
        }

        const lastMsg = conversation[conversation.length - 1];
        if (lastMsg?.content?.includes("visual")) {
            try {
                const visualMatch = lastMsg.content.match(/```json\s*\{[^`]*"visual"\s*:\s*(\{[\s\S]*?\})\s*\}\s*```/);
                if (visualMatch) {
                    const parsed = JSON.parse(visualMatch[1]);
                    const validated = visualSchema.parse(parsed);
                    setVisualBlock(validated);
                    timer = setTimeout(() => setVisualBlock(null), 30000);
                }
            } catch (e) {
                console.warn("Failed to parse visual block:", e);
            }
        }

        return () => clearTimeout(timer);
    }, [conversation, data]);

    if (!visualBlock) return null;

    const { type, payload } = visualBlock;

    return (
        <div className="w-full max-w-4xl mx-auto p-4 space-y-4 bg-white shadow-md rounded-xl">
            {topic && <h2 className="text-xl font-bold">Topic: {topic}</h2>}
            {subject && <p className="text-sm text-gray-500">Subject: {subject}</p>}

            <ErrorBoundary fallback={<div className="text-red-600">Error rendering visual</div>}>
                {type === "math" && <InlineMath math={payload} />}
                {type === "code" && (
                    <SyntaxHighlighter language={payload.language || "javascript"} style={vs2015}>
                        {payload.code}
                    </SyntaxHighlighter>
                )}
                {type === "chart" && <ChartRenderer payload={payload} />}
                {type === "svg" && (
                    <div dangerouslySetInnerHTML={{ __html: payload.svg }} className="w-full h-64" />
                )}
                {type === "3d" && <CanvasRenderer payload={payload} />}
                {type === "whiteboard" && <WhiteboardRenderer />}
            </ErrorBoundary>
        </div>
    );
};

export default VisualDisplay;
