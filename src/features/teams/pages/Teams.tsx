import { Button } from "@/shared/ui/button";

export default function Teams() {
  const teams = [
    { id: "1", name: "UI/UX Design Team", members: 36 },
    { id: "2", name: "Development Team", members: 36 },
    { id: "3", name: "Product Research Team", members: 36 },
    { id: "4", name: "HR Team", members: 36 },
    { id: "5", name: "Marketing Team", members: 36 },
    { id: "6", name: "Motion Design Team", members: 36 },
    { id: "7", name: "Senior Developers Team", members: 36 },
    { id: "8", name: "Managers Team", members: 36 },
  ];
  return (
    <div className="px-6 pb-10">
      <div className="mb-3 flex items-center gap-3 justify-between">
        <div>
          <h1 className="text-lg font-semibold">My Teams</h1>
          <p className="text-sm text-muted-foreground">
            32 Total teams are added
          </p>
        </div>
        <Button variant="soft">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4 mr-2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Team
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {teams.map((t) => (
          <div
            key={t.id}
            className="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                    {t.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </div>

                  <div>
                    <div className="text-sm font-medium leading-tight">
                      {t.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-3.5 w-3.5"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      {t.members} Members
                    </div>
                  </div>
                </div>

                <button className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                  >
                    <circle cx="12" cy="6" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="18" r="1.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
