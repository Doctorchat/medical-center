import { api } from '@/utils/api';

export default async function ProfilePage() {
  try {
    const data = await api.profile.get();
    console.log(data.json());
  } catch (error) {
    console.log(error);
  }

  return <div>Profile</div>;
}
