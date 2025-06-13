import React, { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { z } from "zod";
import { visualSchema } from "./VisualDisplay/schemas";
import { ChartRenderer } from "./VisualDisplay/ChartRenderer";
import { CanvasRenderer } from "./VisualDisplay/CanvasRenderer";
import { WhiteboardRenderer } from "./VisualDisplay/WhiteboardRenderer";
import { InlineMath } from "react-katex";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "katex/dist/katex.min.css";

export const VisualDisplay = () => {
    const { conversation } = useStore();
    const [visualBlock, setVisualBlock] = useState<z.infer<typeof visualSchema> | null>(null);

    useEffect(() => {
        const lastMsg = conversation[conversation.length - 1];
        if (lastMsg?.content?.includes("visual")) {
            try {
                const visualMatch = lastMsg.content.match(/"visual":\s*(\{.*\})/s);
                if (visualMatch) {
                    const parsed = JSON.parse(visualMatch[1]);
                    const validated = visualSchema.parse(parsed);
                    setVisualBlock(validated);
                }
            } catch (e) {
                console.warn("Failed to parse visual block:", e);
            }
        }
    }, [conversation]);

    if (!visualBlock) return null;

    const { type, payload, topic, subject } = visualBlock;

    return (
        <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
            {topic && <h2 className="text-xl font-bold">Topic: {topic}</h2>}
            {subject && <p className="text-sm text-gray-500">Subject: {subject}</p>}

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
        </div>
    );
};
