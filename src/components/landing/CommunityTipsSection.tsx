import { Lightbulb, Sparkles, Calendar, GraduationCap, Tent } from "lucide-react";

const items = [
  {
    icon: GraduationCap,
    title: "Courses & tutoring",
    description: "Languages, music, sports and academic support shared by other DIS families.",
  },
  {
    icon: Tent,
    title: "Summer camps",
    description: "Camps and programmes that other students have actually attended and enjoyed.",
  },
  {
    icon: Calendar,
    title: "Extracurricular activities",
    description: "After-school clubs, workshops and student opportunities around Genova.",
  },
];

export const CommunityTipsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background relative">
      <div className="container">
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--teal))]/10 border border-[hsl(var(--teal))]/20 mb-4">
            <Sparkles className="h-3 w-3 text-[hsl(var(--teal))]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[hsl(var(--teal))] font-semibold">
              Coming soon
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tighter leading-[1.05] mb-4">
            Coming soon: <span className="text-accent">Community Tips</span>.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            A future space where families can share useful recommendations for
            extracurricular activities, courses, summer camps and student
            opportunities.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="relative rounded-xl border border-border bg-card p-6 overflow-hidden group hover:border-accent/40 transition-colors"
            >
              <div className="absolute top-4 right-4 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                Soon
              </div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent mb-4">
                <item.icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-muted-foreground/80 italic flex items-start gap-2 max-w-2xl">
          <Lightbulb className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
          Community Tips will be a space shared by families. It is not an official
          listing or endorsement by Deledda International School.
        </p>
      </div>
    </section>
  );
};
