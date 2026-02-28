export default function Panel({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        rounded-2xl
        bg-white
        border border-[#e8e3db]
        shadow-sm
        p-6
        ${className}
      `}
    >
      {children}
    </div>
  );
}