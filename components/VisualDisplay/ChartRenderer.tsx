import React from "react";
import {
    LineChart, Line,
    BarChart, Bar,
    PieChart, Pie, Cell,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    ScatterChart, Scatter,
    AreaChart, Area,
    XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

export const ChartRenderer = ({ payload }: { payload: any }) => {
    const chartType = payload.chartType || "bar";
    const data = payload.data || [];
    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

    switch (chartType) {
        case "line":
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            );
        case "pie":
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            );
        case "radar":
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={data}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" />
                        <PolarRadiusAxis />
                        <Radar name="Score" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        <Legend />
                    </RadarChart>
                </ResponsiveContainer>
            );
        case "scatter":
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart>
                        <XAxis dataKey="x" type="number" />
                        <YAxis dataKey="y" type="number" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter name="A school" data={data} fill="#8884d8" />
                    </ScatterChart>
                </ResponsiveContainer>
            );
        case "area":
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                </ResponsiveContainer>
            );
        case "bar":
        default:
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            );
    }
};
