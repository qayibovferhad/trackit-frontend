import { Button } from '@/shared/ui/button';
import { User, Users, Mail, Plus } from 'lucide-react';

export default function ProfilePage() {
  const user = {
    name: "Prakash Subramani",
    username: "@prakashjaada",
    avatar: "PS",
    joinedTeams: [
      { id: 1, name: "Johnson's Team", members: '2k', status: 'joined' },
      { id: 2, name: "Development Team", members: '3k', status: 'pending' }
    ],
    about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                {user.avatar}
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{user.name}</h1>
                <p className="text-sm text-gray-500">{user.username}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="violet">
                <User className="w-3.5 h-3.5" />
                Assign Task
              </Button>
              <Button className="bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                <Plus className="w-3.5 h-3.5"/> Invite
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 border-b">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">About</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{user.about}</p>
        </div>

        <div className="p-6 border-b">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Joined Teams ({user.joinedTeams.length})
          </h2>

          <div className="space-y-3">
            {user.joinedTeams.map((team) => (
              <div
                key={team.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{team.name}</h3>
                    <p className="text-xs text-gray-500">
                      <Users className="w-3 h-3 inline mr-0.5" />
                      {team.members} Members
                    </p>
                  </div>
                </div>
                
                {team.status === 'joined' ? (
                  <button className="px-4 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                    + Join
                  </button>
                ) : (
                  <button className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium">
                    + Request
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Mail className="w-8 h-8 text-gray-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Invite others to earn money
                </h3>
                <p className="text-xs text-gray-600">
                  You'll get instant money for each signups
                </p>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
              + Invite Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}