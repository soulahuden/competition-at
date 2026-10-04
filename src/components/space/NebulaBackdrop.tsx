/** Lapisan nebula tambahan di belakang konten. Statis, tidak beranimasi. */
export function NebulaBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      <div className="absolute -left-40 top-[-10%] h-[28rem] w-[28rem] rounded-full bg-violet/[0.13] blur-[120px]" />
      <div className="absolute right-[-12%] top-[22%] h-[24rem] w-[24rem] rounded-full bg-cyan/[0.09] blur-[120px]" />
      <div className="absolute bottom-[-18%] left-[28%] h-[30rem] w-[30rem] rounded-full bg-[#5B21B6]/[0.14] blur-[140px]" />
    </div>
  );
}
