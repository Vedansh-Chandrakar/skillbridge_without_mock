import { RouterProvider } from 'react-router-dom';
import { AuthProvider, RoleProvider } from '@/context';
import { router } from '@/router';

export default function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <RouterProvider router={router} />
      </RoleProvider>
    </AuthProvider>
  );
}
