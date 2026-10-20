type CalculatorHeaderProps = {
  title: string;
  description?: string;
};

export function CalculatorHeader({ title, description }: CalculatorHeaderProps) {
  return (
    <div>
      <h2 className="text-xl font-extrabold tracking-tight text-slate-950">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}
