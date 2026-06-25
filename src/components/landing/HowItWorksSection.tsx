import { UserPlus, Search, Handshake } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Join the community",
    description: "Register with your DIS family email and set up your profile.",
  },
  {
    icon: Search,
    number: "02",
    title: "Search or list",
    description: "Find the books on your child's list — or post the ones you no longer need.",
  },
  {
    icon: Handshake,
    number: "03",
    title: "Meet at school",
    description: "Exchange in person at DIS. No payments handled in-app — parent to parent.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="py-20 md:py-28 bg-secondary/40 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

      <div className="container relative">
        <div className="text-center mb-14">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent mb-3">
            How it works
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tighter">
            Three steps. No paperwork.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5 relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative p-7 rounded-xl bg-card border border-border hover:border-accent/40 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg gradient-primary text-primary-foreground shadow-soft group-hover:shadow-glow transition-shadow">
                  <step.icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <span className="font-mono text-3xl font-bold text-accent/20 group-hover:text-accent/40 transition-colors">
                  {step.number}
                </span>
              </div>

              <h3 className="font-display text-xl font-semibold text-foreground mb-2 tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
