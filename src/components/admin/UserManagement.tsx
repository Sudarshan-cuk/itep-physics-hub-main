import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface User {
  id: string;
  email: string;
  // Add other user properties you might need
}

const UserManagement = () => {
  const { session, isAdmin, loading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [newPassword, setNewPassword] = useState<{ [key: string]: string }>({});

  const fetchUsers = async () => {
    if (!session || !isAdmin) return;

    setIsFetchingUsers(true);
    try {
      const response = await fetch('/functions/v1/user-management/users', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error fetching users: ${response.statusText}`);
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (error: any) {
      toast({
        title: 'Error fetching users',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsFetchingUsers(false);
    }
  };

  const handleChangePassword = async (userId: string) => {
    if (!session || !isAdmin || !newPassword[userId]) return;

    try {
      const response = await fetch('/functions/v1/user-management/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userId, updates: { password: newPassword[userId] } }),
      });
      if (!response.ok) {
        throw new Error(`Error changing password: ${response.statusText}`);
      }
      toast({
        title: 'Password changed',
        description: `Password for user ${userId} has been updated.`,
      });
      setNewPassword((prev) => {
        const newState = { ...prev };
        delete newState[userId];
        return newState;
      });
    } catch (error: any) {
      toast({
        title: 'Error changing password',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!session || !isAdmin) return;

    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/functions/v1/user-management/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        throw new Error(`Error deleting user: ${response.statusText}`);
      }
      toast({
        title: 'User deleted',
        description: `User ${userId} has been deleted.`,
      });
      fetchUsers(); // Refresh the user list
    } catch (error: any) {
      toast({
        title: 'Error deleting user',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [isAdmin, loading, session]);

  if (loading || isFetchingUsers) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
        <p className="text-gray-600">You do not have administrative privileges to view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={newPassword[user.id] || ''}
                    onChange={(e) =>
                      setNewPassword((prev) => ({ ...prev, [user.id]: e.target.value }))
                    }
                    className="max-w-xs"
                  />
                  <Button onClick={() => handleChangePassword(user.id)}>Change Password</Button>
                  <Button variant="destructive" onClick={() => handleDeleteUser(user.id)}>
                    Delete User
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserManagement;