import React from 'react';
import { UpcomingTasksCard } from '@/components/UpcomingTasksCard';

const TasksDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <UpcomingTasksCard />
    </div>
  );
};

export default TasksDemo;
