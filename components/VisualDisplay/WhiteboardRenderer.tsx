import React from "react";
import { Editor as Tldraw } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";

export const WhiteboardRenderer = () => {
    return (
        <div className="w-full h-[500px] rounded-xl border">
            <Tldraw />
        </div>
    );
};
