import { CheckSquare, Clock, Users, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  addRecentSearch,
  getRecentSearches,
  globalSearch,
  removeRecentSearch,
} from '../services/search.service';
import { PATHS } from '@/shared/constants/routes';
import UserAvatar from '@/shared/components/UserAvatar';
import { useState, useCallback } from 'react';
import { Button } from '@/shared/ui/button';

type Props = {
  query: string;
  onClose: () => void;
  onSelectRecent: (q: string) => void;
};

export default function SearchDropdown({ query, onClose, onSelectRecent }: Props) {
  const navigate = useNavigate();
  const [recents, setRecents] = useState<string[]>(getRecentSearches);

  const trimmed = query.trim();

  const { data, isLoading } = useQuery({
    queryKey: ['search-preview', trimmed],
    queryFn: () => globalSearch(trimmed),
    enabled: trimmed.length >= 2,
    staleTime: 30_000,
  });

  const goToSearch = useCallback(
    (q: string) => {
      addRecentSearch(q);
      setRecents(getRecentSearches());
      navigate(`${PATHS.SEARCH}?q=${encodeURIComponent(q)}`);
      onClose();
    },
    [navigate, onClose],
  );

  const handleRemoveRecent = useCallback(
    (e: React.MouseEvent, q: string) => {
      e.stopPropagation();
      removeRecentSearch(q);
      setRecents(getRecentSearches());
    },
    [],
  );

  const hasResults =
    data && (data.tasks.length > 0 || data.announcements.length > 0 || data.teams.length > 0);

  return (
    <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border bg-white shadow-lg z-50 overflow-hidden">
      {/* Recent Searches */}
      {recents.length > 0 && (
        <div className="px-3 pt-3 pb-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
            Recent Search
          </p>
          <ul>
            {recents.map((r) => (
              <li
                key={r}
                onClick={() => {
                  onSelectRecent(r);
                  goToSearch(r);
                }}
                className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Clock size={13} className="shrink-0 text-gray-400" />
                  <span className="truncate">{r}</span>
                </div>
                <button
                  onClick={(e) => handleRemoveRecent(e, r)}
                  className="shrink-0 text-gray-300 hover:text-gray-500"
                  aria-label="Remove"
                >
                  <X size={13} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Live Results */}
      {trimmed.length >= 2 && (
        <>
          {isLoading && (
            <div className="px-4 py-3 text-sm text-gray-400">Searching…</div>
          )}

          {!isLoading && hasResults && (
            <div className="px-3 pt-2 pb-3 border-t">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
                Search for other tabs and features
              </p>

              {data.tasks.length > 0 && (
                <>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-300 px-2 mt-2 mb-0.5">
                    Task Search Results
                  </p>
                  {data.tasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      onClick={() => {
                        navigate(`/task/${task.id}`);
                        onClose();
                      }}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      <CheckSquare size={13} className="shrink-0 text-violet-400" />
                      <span className="truncate flex-1">{task.title}</span>
                      <span className="text-[11px] text-gray-400 shrink-0">Task</span>
                    </div>
                  ))}
                </>
              )}

              {data.announcements.length > 0 && (
                <>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-300 px-2 mt-2 mb-0.5">
                    Announcement Search Results
                  </p>
                  {data.announcements.slice(0, 2).map((a) => (
                    <div
                      key={a.id}
                      onClick={() => {
                        navigate(PATHS.ANNOUNCEMENTS);
                        onClose();
                      }}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      <UserAvatar
                        src={a.author.profileImage}
                        name={a.author.name}
                        size="sm"
                        className="border-0 shrink-0"
                      />
                      <span className="truncate flex-1">{a.title}</span>
                      <span className="text-[11px] text-gray-400 shrink-0">Announcement</span>
                    </div>
                  ))}
                </>
              )}

              {data.teams.length > 0 && (
                <>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-300 px-2 mt-2 mb-0.5">
                    Teams Search Results
                  </p>
                  {data.teams.slice(0, 2).map((team) => (
                    <div
                      key={team.id}
                      onClick={() => {
                        navigate(PATHS.TEAMS);
                        onClose();
                      }}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      <Users size={13} className="shrink-0 text-blue-400" />
                      <span className="truncate flex-1">{team.name}</span>
                      <span className="text-[11px] text-gray-400 shrink-0">Team</span>
                    </div>
                  ))}
                </>
              )}

              {/* View all */}
              <Button
                variant="soft"
                size="sm"
                className="mt-2 w-full justify-start"
                onClick={() => goToSearch(trimmed)}
              >
                View all results for "{trimmed}"
              </Button>
            </div>
          )}

          {!isLoading && !hasResults && trimmed.length >= 2 && (
            <div className="px-4 py-3 text-sm text-gray-400 border-t">
              No results for "{trimmed}"
            </div>
          )}
        </>
      )}
    </div>
  );
}
