'use client';
// import React, { useEffect } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { useAppSelector } from '@/store';

// const GuestGuard = ({ children }) => {
//   const router = useRouter();
//   const pathName = usePathname();

//   const checkUserIsLoggedIn = useAppSelector((state) => state.auth.isUser);

//   useEffect(() => {
//     if (true) {
//       pathName == '/login' ? router.push('/option-wizard') : router.push(`${pathName}`);
//     } else {
//       router.push('/login');
//     }
//   }, [router, pathName]);

//   return <>{children}</>;
// };

// export default GuestGuard;