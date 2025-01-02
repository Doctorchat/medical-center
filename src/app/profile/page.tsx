'use client';
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { status } = useSession();

  console.log(status);

  return <div>Profile</div>;
}
