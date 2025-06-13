import { z } from "zod";

export const visualSchema = z.object({
    type: z.enum(["math", "code", "chart", "svg", "3d", "whiteboard"]),
    payload: z.any(),
    topic: z.string().optional(),
    subject: z.string().optional(),
});