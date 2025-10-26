import { Button } from '@/shared/ui/button';
import { User, Users, Mail, Plus } from 'lucide-react';
import { getProfileData } from '../services/profile.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import UserAvatar from '@/shared/components/UserAvatar';
import { joinToTeam } from '@/features/teams/services/teams.service';
import { useState } from 'react';
import TaskModal from '@/features/tasks/components/task/TaskModal';
import { useTaskMutations } from '@/features/tasks/hooks/useTaskMutations';
import InviteTeamModal from '@/features/teams/components/InviteTeamModal';

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [openTaskModal,setOpenTaskModal] = useState(false) 
  const [openInviteModal,setOpenInviteModal] = useState(false)
  const queryClient = useQueryClient();

  const { createTaskMutation } = useTaskMutations();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => getProfileData(username!),
    enabled: !!username,
  });


  const { mutateAsync: sendJoinRequest, isPending } = useMutation({
    mutationFn: joinToTeam,
    onSuccess(){
      queryClient.invalidateQueries({ queryKey: ["profile",username] });
    }
  });

  if (isLoading) return <div className="p-6 text-center">Loading profile...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Failed to load profile</div>;
  if (!user) return null;

  console.log(user, 'useruser');

  return (
    <>
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <UserAvatar src={user?.profileImage} />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{user.name}</h1>
                <p className="text-sm text-gray-500">{user.username}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="violet" onClick={()=>setOpenTaskModal(true)}>
                <User className="w-3.5 h-3.5" />
                Assign Task
              </Button>
              <Button className="bg-purple-600 text-white hover:bg-purple-700 transition-colors" onClick={()=>setOpenInviteModal(true)}>
                <Plus className="w-3.5 h-3.5" /> Invite
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 border-b">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">About</h2>
          {user.description ? (
            <p className="text-sm text-gray-600 leading-relaxed">{user.description}</p>
          ) : (
            <p className="text-sm text-gray-400 italic">No description provided.</p>
          )}
        </div>

        <div className="p-6 border-b">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Joined Teams ({user?.teams?.length || 0})
          </h2>

          {user?.teams && user.teams.length > 0 ? (
            <div className="space-y-3">
              {user.teams.map((team) => (
                <div key={team.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{team.name}</h3>
                      <p className="text-xs text-gray-500">
                        <Users className="w-3 h-3 inline mr-0.5" />
                        {team?.users?.length} Members
                      </p>
                    </div>
                  </div>

                  {team.joined ? (
                    <Button disabled variant="outline">Joined</Button>
                  ) : team.requested ? (
                    <Button disabled>Request Sent</Button>
                  ) : (
                    <Button disabled={isPending} onClick={() => sendJoinRequest(team.id)}>+ Request</Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No joined teams yet.</p>
          )}
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
    {openTaskModal && <TaskModal open={openTaskModal} onOpenChange={setOpenTaskModal} defaultUser={user} onAddTask={(data)=>createTaskMutation.mutate(data)}/> }
    {openInviteModal && <InviteTeamModal open={openInviteModal} onOpenChange={setOpenInviteModal} userId={user.id}/>}
    </>
  );
}