import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLearningStore } from '../../store/learningStore';

const ProgressChart = () => {
  const { progress } = useLearningStore();

  const data = progress.map(subject => ({
    subject: subject.subject,
    progress: subject.progress,
    mastery: subject.mastery,
    timeSpent: Math.floor(subject.timeSpent / 60) // Convert to hours
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="subject" 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff'
            }}
            formatter={(value, name) => [
              `${value}${name === 'timeSpent' ? 'h' : '%'}`,
              name === 'progress' ? 'Progress' : name === 'mastery' ? 'Mastery' : 'Time Spent'
            ]}
          />
          <Bar 
            dataKey="progress" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
            name="progress"
          />
          <Bar 
            dataKey="mastery" 
            fill="#14b8a6" 
            radius={[4, 4, 0, 0]}
            name="mastery"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;