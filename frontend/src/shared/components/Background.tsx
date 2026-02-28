export default function Background({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4efe9] text-[#1a1820]">
      {children}
    </div>
  );
}