import { SessionsList } from './_components/sessions-list';

const SessionsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sesiones Activas</h1>
        <p className="text-muted-foreground">Administra tus sesiones activas en diferentes dispositivos</p>
      </div>
      <SessionsList />
    </div>
  );
};

export default SessionsPage;
