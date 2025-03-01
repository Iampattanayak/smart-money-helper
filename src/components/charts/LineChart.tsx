
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '@/lib/utils';

interface ChartData {
  name: string;
  [key: string]: string | number;
}

interface ChartSeries {
  name: string;
  dataKey: string;
  color: string;
  stackId?: string;
}

interface LineChartProps {
  title: string;
  data: ChartData[];
  series: ChartSeries[];
  type?: 'area' | 'bar';
  className?: string;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number) => string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  title,
  data,
  series,
  type = 'area',
  className,
  yAxisFormatter = (value) => value.toString(),
  tooltipFormatter = (value) => value.toString(),
  xAxisLabel,
  yAxisLabel,
}) => {
  return (
    <Card className={cn(
      "w-full border border-border/60 shadow-smooth animate-fade-in",
      className
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium tracking-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'area' ? (
              <AreaChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
                />
                <YAxis 
                  tickFormatter={yAxisFormatter}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  width={60}
                  label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
                />
                <Tooltip 
                  formatter={tooltipFormatter}
                  contentStyle={{ borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Legend />
                {series.map((s) => (
                  <Area
                    key={s.dataKey}
                    type="monotone"
                    dataKey={s.dataKey}
                    name={s.name}
                    stroke={s.color}
                    fill={s.color}
                    fillOpacity={0.2}
                    stackId={s.stackId}
                    animationDuration={1500}
                  />
                ))}
              </AreaChart>
            ) : (
              <BarChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
                />
                <YAxis 
                  tickFormatter={yAxisFormatter}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  width={60}
                  label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
                />
                <Tooltip 
                  formatter={tooltipFormatter}
                  contentStyle={{ borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Legend />
                {series.map((s) => (
                  <Bar
                    key={s.dataKey}
                    dataKey={s.dataKey}
                    name={s.name}
                    fill={s.color}
                    stackId={s.stackId}
                    animationDuration={1500}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LineChart;
