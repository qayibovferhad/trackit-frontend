import { useQuery } from "@tanstack/react-query";
import { getPersonalDetails } from "../services/settings.service";
import ProfileSection from "../components/ProfileSection";
import ContactSection from "../components/ContactSection";

export default function PersonalDetailsSettings() {
  const {
    data: personalData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["personal-details"],
    queryFn: getPersonalDetails,
  });

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
