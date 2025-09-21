import React from 'react';
import { ArrowUpRight, Filter } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  subtasks: number;
  dueDate: string;
  isHighlighted?: boolean;
  icon?: string;
}

interface UpcomingTasksCardProps {
  tasks?: Task[];
}

const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Design review',
    subtasks: 20,
    dueDate: '01.07.2023',
    isHighlighted: true,
    icon: 'E'
  },
  {
    id: '2',
    title: 'Finish the Work',
    subtasks: 8,
    dueDate: '02.07.2023'
  },
  {
    id: '3',
    title: 'Client Meeting',
    subtasks: 12,
    dueDate: '04.07.2023'
  }
];

export const UpcomingTasksCard: React.FC<UpcomingTasksCardProps> = ({
  tasks = defaultTasks
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-black">Upcoming Tasks</h2>
        <div className="flex items-center space-x-1">
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <Filter className="w-4 h-4 text-gray-400 ml-1" />
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`rounded-xl p-4 transition-all duration-200 ${
              task.isHighlighted
                ? 'bg-black text-white'
                : 'bg-gray-50 text-black hover:bg-gray-100'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                {/* Icon */}
                {task.icon && (
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border ${
                      task.isHighlighted
                        ? 'bg-green-500 text-white border-white'
                        : 'bg-green-500 text-white border-green-500'
                    }`}
                  >
                    {task.icon}
                  </div>
                )}
                
                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm leading-tight mb-1">
                    {task.title}
                  </h3>
                  <p className={`text-xs ${
                    task.isHighlighted ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {task.subtasks} subtask{task.subtasks !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Right Side - Arrow and Date */}
              <div className="flex flex-col items-end space-y-1">
                <ArrowUpRight 
                  className={`w-4 h-4 ${
                    task.isHighlighted ? 'text-white' : 'text-black'
                  }`} 
                />
                <span className={`text-xs ${
                  task.isHighlighted ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {task.dueDate}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
