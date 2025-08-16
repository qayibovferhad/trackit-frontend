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

  //   if (isLoading) {
  //     return (
  //       <SettingsBox title="Personal Details">
  //         <div className="animate-pulse space-y-4">
  //           <div className="h-32 bg-gray-200 rounded" />
  //           <div className="space-y-3">
  //             {Array.from({ length: 4 }).map((_, i) => (
  //               <div key={i} className="h-12 bg-gray-200 rounded" />
  //             ))}
  //           </div>
  //         </div>
  //       </SettingsBox>
  //     );
  //   }

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
