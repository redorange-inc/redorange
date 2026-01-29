import { ProfileForm } from './_components/profile-form';

const ProfilePage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground">Administra tu información personal</p>
      </div>
      <ProfileForm />
    </div>
  );
};

export default ProfilePage;
