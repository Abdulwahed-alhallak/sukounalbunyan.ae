import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

interface RentalPredictiveChartProps {
    data: any[];
}

export default function RentalPredictiveChart({ data }: RentalPredictiveChartProps) {
    const { t } = useTranslation();

    // Default mock data if no data provided
    const chartData = data && data.length > 0 ? data : [
        { date: 'Mon', available: 120, rented: 45, predicted_demand: 50 },
        { date: 'Tue', available: 110, rented: 55, predicted_demand: 60 },
        { date: 'Wed', available: 105, rented: 60, predicted_demand: 65 },
        { date: 'Thu', available: 90, rented: 75, predicted_demand: 80 },
        { date: 'Fri', available: 60, rented: 105, predicted_demand: 110 },
        { date: 'Sat', available: 50, rented: 115, predicted_demand: 125 },
        { date: 'Sun', available: 45, rented: 120, predicted_demand: 130 },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('Predictive Inventory Availability')}</CardTitle>
                <CardDescription>{t('Forecasted equipment demand and availability')}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                        <LineChart
                            data={chartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="available" 
                                name={t('Available')} 
                                stroke="#10b981" 
                                strokeWidth={3}
                                dot={{ r: 4 }} 
                                activeDot={{ r: 6 }} 
                            />
                            <Line 
                                type="monotone" 
                                dataKey="rented" 
                                name={t('Rented')} 
                                stroke="#f59e0b" 
                                strokeWidth={3}
                                dot={{ r: 4 }} 
                            />
                            <Line 
                                type="monotone" 
                                dataKey="predicted_demand" 
                                name={t('Predicted Demand')} 
                                stroke="#3b82f6" 
                                strokeDasharray="5 5" 
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
