'use client';

export const BackgroundEffects = () => {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat opacity-30 dark:opacity-20" style={{ backgroundImage: 'url(/img/infra.png)' }} />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-linear-to-b from-background/80 via-background/60 to-background/90" />
    </>
  );
};
