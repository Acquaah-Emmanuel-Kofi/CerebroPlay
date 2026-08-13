'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOrCreateGuestUser } from '@cerebro-play/user';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    getOrCreateGuestUser()
      .then((user) => {
        router.replace(user.role ? '/home' : '/onboarding');
      })
      .catch(console.error);
  }, [router]);

  return null;
}
