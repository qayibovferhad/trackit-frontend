import { useState } from "react";
import { STEP_CONFIG } from "../constants";
import { StepSkills } from "../components/StepSkills";
import { StepCompany } from "../components/StepCompany";
import { StepExperience } from "../components/StepExperience";
import { StepAccountType } from "../components/StepAccountType";


export default function Onboarding({ onComplete }:{onComplete:any}) {
  const [step, setStep] = useState(0);
  const [accountType, setAccountType] = useState(null);
  const [skills, setSkills] = useState([]);
  const [company, setCompany] = useState({ name: "", sector: "", size: "" });
  const [experience, setExperience] = useState(null);

  const steps = accountType ? STEP_CONFIG[accountType] : STEP_CONFIG["personal"];
  const totalSteps = steps.length;
  const current = steps[step];

  const toggleSkill = (skill) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const canNext = () => {
    if (current.key === "accountType") return !!accountType;
    if (current.key === "skills") return skills.length > 0;
    if (current.key === "company") return !!company.name && !!company.sector;
    if (current.key === "experience") return !!experience;
    return true;
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    } else {
      onComplete?.({ accountType, skills, company, experience });
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
            <StepAccountType value={accountType} onChange={(v) => { setAccountType(v); setSkills([]); }} />
          )}
          {current.key === "skills" && (
            <StepSkills selected={skills} onToggle={toggleSkill} />
          )}
          {current.key === "company" && (
            <StepCompany data={company} onChange={setCompany} />
          )}
          {current.key === "experience" && (
            <StepExperience value={experience} onChange={setExperience} />
          )}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={!canNext()}
          className={`w-full mt-6 py-4 rounded-2xl text-sm font-bold tracking-wide transition-all
            ${canNext() ? "bg-gray-900 text-white hover:bg-gray-800 cursor-pointer" : "bg-gray-100 text-gray-300 cursor-not-allowed"}`}
        >
          {step === totalSteps - 1 ? "Finish 🎉" : "Next"}
        </button>

        {/* Footer */}
        <div className="flex items-center justify-between mt-5">
          <div className="flex items-center gap-1.5">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="text-gray-300 hover:text-gray-500 text-base mr-1 cursor-pointer bg-transparent border-none"
              >
                ←
              </button>
            )}
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${i === step ? "w-5 bg-violet-500" : "w-2 bg-gray-200"}`}
              />
            ))}
          </div>
          <button
            onClick={() => onComplete?.({ accountType, skills, company, experience })}
            className="text-xs font-semibold text-violet-500 hover:text-violet-700 cursor-pointer bg-transparent border-none"
          >
            Skip Steps
          </button>
        </div>

      </div>
    </div>
  );
}