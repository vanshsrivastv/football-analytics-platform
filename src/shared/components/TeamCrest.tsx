type TeamCrestProps = {
  crestUrl?: string | null;
  size?: "sm" | "md" | "lg";
};

const sizeMap = { sm: 26, md: 34, lg: 44 };

export function TeamCrest({ crestUrl, size = "md" }: TeamCrestProps) {
  const px = sizeMap[size];
  return (
    <div
      style={{ width: px, height: px }}
      className="rounded-full bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center"
    >
      {crestUrl ? (
        <img src={crestUrl} alt="" className="w-full h-full object-cover" />
      ) : null}
    </div>
  );
}