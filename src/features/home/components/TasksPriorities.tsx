import { useTasksQuery } from "@/features/tasks/hooks/useTasks";
import type { TaskFilter } from "@/features/tasks/types/tasks";
import { Button } from "@/shared/ui/button";
import { formatDate } from "@/shared/utils/date";
import { Tag } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function TasksPriorities  ()  {
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('upcoming');

  const { data, isLoading } = useTasksQuery(activeFilter);

  return (<>
    <div className="rounded-xl border bg-white p-5 h-[500px] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Tasks Priorities</h3>
          <p className="text-sm text-gray-500">
            Team tasks sorted by priority
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          onClick={() => setActiveFilter('upcoming')}
          variant={activeFilter === 'upcoming' ? "violet" : "secondary"}
          size={'sm'}
        >
          {data?.meta.upcoming || 0} Upcoming
        </Button>
        <Button
          size={'sm'}
          variant={activeFilter === 'overdue' ? "violet" : "secondary"}
          onClick={() => setActiveFilter('overdue')}
        >
          {data?.meta.overdue || 0} Overdue
        </Button>
        <Button
          size={'sm'}
          variant={activeFilter === 'completed' ? "violet" : "secondary"}
          onClick={() => setActiveFilter('completed')}

        >
          {data?.meta.completed || 0} Completed
        </Button>
      </div>
      {isLoading ? (
        <div className="mt-4 space-y-4 overflow-y-auto flex-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 animate-pulse">
              <div className="h-4 w-4 bg-gray-200 rounded mt-0.5" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) :
        <ul className="mt-4 space-y-4 overflow-y-auto flex-1">
          {!data?.data || data.data.length === 0 ? (
            <li className="py-8 text-center text-sm text-gray-500">
              No {activeFilter} tasks
            </li>
          ) :
            <>
              {data.data.map(task => (
                <li key={task.id} className="">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="shrink-0" />
                    <Link to={`/task/${task.id}`} className="text-md font-medium">
                      {task.title}
                    </Link>
                  </div>

                  <div className="mt-2 ml-6">
                    <div className="flex items-center gap-4 flex-wrap">
                      {task.dueAt && <p className="text-sm text-gray-500">
                        {formatDate(task.dueAt)}
                      </p>}


                      {task?.tags && task.tags.length > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <Tag size={16} />
                          <div className="flex gap-2 flex-wrap">
                            {task.tags.map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded text-xs bg-gray-100 uppercase"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <Tag size={16} />
                          <span className="px-2 py-0.5 rounded text-xs bg-gray-100">
                            No Tag
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </>
          }
        </ul>}
    </div>
  </>
  );
};
