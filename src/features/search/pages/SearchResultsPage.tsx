import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckSquare, Users, Megaphone, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { globalSearch, addRecentSearch } from '../services/search.service';
import UserAvatar from '@/shared/components/UserAvatar';
import type { SearchAnnouncement, SearchTask, SearchTeam } from '../types/search.types';

export default function SearchResultsPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const q = params.get('q') ?? '';

  const { data, isLoading } = useQuery({
    queryKey: ['search', q],
    queryFn: () => globalSearch(q),
    enabled: q.length > 0,
    staleTime: 60_000,
  });

  useEffect(() => {
    document.title = q ? `Search: ${q}` : 'Search';
    if (q) addRecentSearch(q);
  }, [q]);

  if (!q) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-gray-400">
        Enter a search term to get started.
      </div>
    );
  }

  return (
    <div className="px-6 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-gray-700 mb-3 flex items-center gap-1"
        >
          ← Search Results
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Search Results for{' '}
              <span className="text-violet-600">"{q}"</span>
            </h1>
            {data && (
              <p className="text-sm text-gray-400 mt-0.5">
                {data.total}+ results founded in{' '}
                {[
                  data.tasks.length > 0 && 'tasks',
                  data.announcements.length > 0 && 'announcements',
                  data.teams.length > 0 && 'teams',
                ]
                  .filter(Boolean)
                  .join(', ')}{' '}
                tabs
              </p>
            )}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && data && (
        <div className="space-y-6">
          {/* Tasks */}
          {data.tasks.length > 0 && (
            <Section title="Tasks Search Results" icon={<CheckSquare size={15} className="text-violet-500" />}>
              {data.tasks.map((task) => (
                <TaskRow key={task.id} task={task} onClick={() => navigate(`/task/${task.id}`)} />
              ))}
            </Section>
          )}

          {/* Announcements */}
          {data.announcements.length > 0 && (
            <Section title="Announcements Search Results" icon={<Megaphone size={15} className="text-orange-500" />}>
              {data.announcements.map((a) => (
                <AnnouncementRow key={a.id} announcement={a} />
              ))}
            </Section>
          )}

          {/* Teams */}
          {data.teams.length > 0 && (
            <Section title="Teams Search Results" icon={<Users size={15} className="text-blue-500" />}>
              {data.teams.map((team) => (
                <TeamRow key={team.id} team={team} onClick={() => navigate('/teams')} />
              ))}
            </Section>
          )}

          {data.total === 0 && (
            <div className="py-16 text-center text-sm text-gray-400">
              No results found for "{q}".
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b bg-gray-50">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {title}
        </span>
      </div>
      <ul className="divide-y">{children}</ul>
    </div>
  );
}

function TaskRow({ task, onClick }: { task: SearchTask; onClick: () => void }) {
  return (
    <li
      onClick={onClick}
      className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 cursor-pointer"
    >
      <CheckSquare
        size={16}
        className={task.completedAt ? 'text-green-500' : 'text-gray-300'}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{task.title}</p>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
          {task.dueAt && (
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {format(new Date(task.dueAt), 'dd MMM yyyy')}
            </span>
          )}
          {task.column && <span>{task.column.title}</span>}
          {task.assignee?.name && <span>{task.assignee.name}</span>}
        </div>
      </div>
      {task.assignee && (
        <UserAvatar
          src={task.assignee.profileImage}
          name={task.assignee.name}
          size="sm"
          className="border-0 shrink-0"
        />
      )}
      <button className="text-gray-300 hover:text-gray-500 ml-1">···</button>
    </li>
  );
}

function AnnouncementRow({ announcement }: { announcement: SearchAnnouncement }) {
  return (
    <li className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 cursor-pointer">
      <UserAvatar
        src={announcement.author.profileImage}
        name={announcement.author.name}
        size="sm"
        className="border-0 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{announcement.title}</p>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {format(new Date(announcement.createdAt), 'dd MMM yyyy · HH:mm')}
          </span>
          {announcement.author.name && (
            <span>From {announcement.author.name}</span>
          )}
        </div>
      </div>
      <button className="text-gray-300 hover:text-gray-500 ml-1">···</button>
    </li>
  );
}

function TeamRow({ team, onClick }: { team: SearchTeam; onClick: () => void }) {
  return (
    <li
      onClick={onClick}
      className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 cursor-pointer"
    >
      <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
        <Users size={14} className="text-blue-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{team.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {team._count.users} Members · Created at{' '}
          {format(new Date(team.createdAt), 'dd MMM yyyy')}
        </p>
      </div>
      <button className="text-gray-300 hover:text-gray-500 ml-1">···</button>
    </li>
  );
}
