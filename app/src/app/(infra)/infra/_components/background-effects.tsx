'use client';

export const BackgroundEffects = () => {
  return (
    <>
      {/* Imagen de fondo */}
      <div className="pointer-events-none fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat opacity-30 dark:opacity-20" style={{ backgroundImage: 'url(/img/infra.png)' }} />
      {/* Overlay para mejorar legibilidad */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
    </>
  );
};
