import React from 'react';
import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';

interface BarChartProps {
    data: any[];
    dataKey: string;
    xAxisKey: string;
    color?: string;
    horizontal?: boolean;
    stacked?: boolean;
    showLegend?: boolean;
    showGrid?: boolean;
    showTooltip?: boolean;
    height?: number;
    bars?: Array<{
        dataKey: string;
        color: string;
        name?: string;
    }>;
    activeIndex?: number;
    negative?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
    data,
    dataKey,
    xAxisKey,
    color = 'hsl(var(--blue-7))',
    horizontal = false,
    stacked = false,
    showLegend = false,
    showGrid = true,
    showTooltip = true,
    height = 350,
    bars = [],
    activeIndex,
    negative = false,
}) => {
    const layout = horizontal ? { layout: 'horizontal' as const } : {};

    return (
        <ResponsiveContainer width="100%" height={height} minWidth={0}>
            <RechartsBarChart
                data={data}
                margin={horizontal ? { left: 80, right: 12 } : { left: 12, right: 12 }}
                {...layout}
            >
                {showGrid && <CartesianGrid vertical={false} stroke="hsl(var(--gray-4))" strokeDasharray="3 3" />}
                {horizontal ? (
                    <>
                        <XAxis
                            type="number"
                            domain={negative ? ['dataMin', 'dataMax'] : [0, 'dataMax']}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis 
                            type="category" 
                            dataKey={xAxisKey} 
                            tickLine={false} 
                            axisLine={false} 
                            width={70} 
                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        />
                    </>
                ) : (
                    <>
                        <XAxis 
                            dataKey={xAxisKey} 
                            tickLine={false} 
                            axisLine={false} 
                            tickMargin={12} 
                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis
                            domain={negative ? ['dataMin', 'dataMax'] : [0, 'dataMax']}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={12}
                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        />
                    </>
                )}
                {showTooltip && (
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'hsl(var(--background))', 
                            borderColor: 'hsl(var(--gray-4))',
                            borderRadius: '8px',
                            boxShadow: 'var(--shadow-tooltip)',
                            fontSize: '12px'
                        }}
                    />
                )}
                {showLegend && <Legend />}
                {bars.length > 0 ? (
                    bars.map((bar) => (
                        <Bar
                            key={bar.dataKey}
                            dataKey={bar.dataKey}
                            name={bar.name}
                            stackId={stacked ? '1' : undefined}
                            fill={bar.color}
                            radius={4}
                        />
                    ))
                ) : (
                    <Bar dataKey={dataKey} fill={color} radius={4}>
                        {activeIndex !== undefined &&
                            data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === activeIndex ? '#10b77f' : color} />
                            ))}
                    </Bar>
                )}
            </RechartsBarChart>
        </ResponsiveContainer>
    );
};
