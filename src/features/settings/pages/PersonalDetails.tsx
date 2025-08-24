import { useQuery } from "@tanstack/react-query";
import { getPersonalDetails } from "../services/settings.service";
import ProfileSection from "../components/ProfileSection";
import ContactSection from "../components/ContactSection";
import { useUserStore } from "@/stores/userStore";
import { useEffect } from "react";

export default function PersonalDetailsSettings() {
  const { user, setUser } = useUserStore();
  const {
    data: personalData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["personal-details"],
    queryFn: getPersonalDetails,
    initialData: user ? { ...user } : undefined,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (personalData) setUser(personalData);
  }, [personalData, setUser]);

  return (
    <div className="space-y-4">
      <ProfileSection
        data={personalData}
        isLoading={isLoading}
        refetch={refetch}
      />
      <ContactSection data={personalData} refetch={refetch} />
    </div>
  );
}
