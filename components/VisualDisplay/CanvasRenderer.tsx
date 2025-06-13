import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export const CanvasRenderer = ({ payload }: { payload: React.ReactNode }) => {
    return (
        <Canvas className="w-full h-64 bg-gray-900 rounded-xl">
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 2, 5]} intensity={1} />
            <OrbitControls />
            {payload}
        </Canvas>
    );
};