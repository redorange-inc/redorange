import { SecuritySettings } from './_components/security-settings';

const SecurityPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Seguridad</h1>
        <p className="text-muted-foreground">Administra la seguridad de tu cuenta</p>
      </div>
      <SecuritySettings />
    </div>
  );
};

export default SecurityPage;
