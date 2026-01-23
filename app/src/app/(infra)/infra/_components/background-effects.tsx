'use client';

export const BackgroundEffects = () => {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 h-[800px] w-[800px] rounded-full bg-gradient-to-br from-infra/5 via-infra/3 to-transparent blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-infra-muted/5 via-infra/2 to-transparent blur-3xl" />
      </div>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-pattern" />
    </>
  );
};
