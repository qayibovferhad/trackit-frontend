import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { STEP_CONFIG } from "../constants";
import { StepSkills } from "../components/StepSkills";
import { StepCompany } from "../components/StepCompany";
import { StepExperience } from "../components/StepExperience";
import { StepAccountType } from "../components/StepAccountType";
import { StepRole } from "../components/StepRole";
import { StepGoal } from "../components/StepGoal";
import { completeOnboardingRequest } from "@/features/auth/services/auth.service";
import { useUserStore } from "@/stores/userStore";
import { useZodForm } from "@/shared/hooks/useZodForm";
import { onboardingSchema } from "../schemas/onboarding.schema";
import { Button } from "@/shared/ui/button";
import { useState, useEffect } from "react";

export default function Onboarding() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const updateUser = useUserStore((s) => s.updateUser);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (user?.isOnboarded) {
      navigate("/", { replace: true });
    }
  }, [user?.isOnboarded]);

  if (user?.isOnboarded) return null;

  const { register, watch, setValue, formState: { errors } } = useZodForm(onboardingSchema, {
    defaultValues: {
      accountType: undefined,
      skills: [],
      companyName: "",
      companySector: "",
      companySize: "",
      experience: undefined,
    },
  });

  const accountType = watch("accountType");
  const steps = accountType ? STEP_CONFIG[accountType] : STEP_CONFIG["personal"];
  const totalSteps = steps.length;
  const current = steps[step];

  const canNext = () => {
    if (current.key === "accountType") return !!watch("accountType");
    if (current.key === "skills") return (watch("skills") ?? []).length > 0;
    if (current.key === "company") return !!watch("companyName") && !!watch("companySector");
    if (current.key === "experience") return !!watch("experience");
    if (current.key === "role") return !!watch("role");
    if (current.key === "goal") return !!watch("goal");
    return true;
  };

  const { mutate: finishOnboarding, isPending } = useMutation({
    mutationFn: completeOnboardingRequest,
    onSuccess: () => {
      updateUser({ isOnboarded: true });
      navigate("/");
    },
  });

  const handleFinish = () => finishOnboarding(watch());

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    } else {
      handleFinish();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-3xl w-full max-w-md p-9 shadow-lg shadow-gray-100">

        {/* Header */}
        <div className="text-center mb-7">
          <h1 className="text-xl font-bold text-gray-900 leading-snug">{current.title}</h1>
          <p className="text-sm text-gray-400 mt-1.5">{current.subtitle}</p>
        </div>

        {/* Content */}
        <div className="min-h-64">
          {current.key === "accountType" && (
            <StepAccountType
              value={watch("accountType")}
              onChange={(v) => { setValue("accountType", v); setValue("skills", []); }}
            />
          )}
          {current.key === "skills" && (
            <StepSkills
              selected={watch("skills") ?? []}
              onToggle={(skill) => {
                const current = watch("skills") ?? [];
                setValue(
                  "skills",
                  current.includes(skill) ? current.filter((s) => s !== skill) : [...current, skill]
                );
              }}
            />
          )}
          {current.key === "company" && (
            <StepCompany
              register={register}
              errors={errors}
              sector={watch("companySector")}
              size={watch("companySize")}
              onSectorChange={(s) => setValue("companySector", s)}
              onSizeChange={(s) => setValue("companySize", s)}
            />
          )}
          {current.key === "experience" && (
            <StepExperience
              value={watch("experience")}
              onChange={(v) => setValue("experience", v)}
            />
          )}
          {current.key === "role" && (
            <StepRole
              value={watch("role")}
              onChange={(v) => setValue("role", v)}
            />
          )}
          {current.key === "goal" && (
            <StepGoal
              value={watch("goal")}
              onChange={(v) => setValue("goal", v)}
            />
          )}
        </div>

        {/* Next button */}
        <Button
          onClick={handleNext}
          disabled={!canNext() || isPending}
          className="w-full mt-6 py-4 rounded-2xl text-sm font-bold tracking-wide"
        >
          {isPending ? "Saving..." : step === totalSteps - 1 ? "Finish 🎉" : "Next"}
        </Button>

        {/* Footer */}
        <div className="flex items-center justify-between mt-5">
          <div className="flex items-center gap-1.5">
            {step > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setStep((s) => s - 1)}
                className="text-gray-400 hover:text-gray-600"
              >
                ←
              </Button>
            )}
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${i === step ? "w-5 bg-violet-500" : "w-2 bg-gray-200"}`}
              />
            ))}
          </div>
          <Button
            variant="link"
            onClick={handleFinish}
            disabled={isPending}
            className="text-xs font-semibold text-violet-500 hover:text-violet-700 p-0"
          >
            Skip Steps
          </Button>
        </div>

      </div>
    </div>
  );
}
