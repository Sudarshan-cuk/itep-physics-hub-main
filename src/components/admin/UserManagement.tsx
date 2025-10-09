import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  email: string;
}

const UserManagement = () => {
  const { isAdmin, loading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      if (isAdmin) {
        const { data: { users }, error } = await supabase.auth.admin.listUsers();
        if (error) {
          toast({ title: 'Error fetching users', description: error.message, variant: 'destructive' });
        } else {
          setUsers(users as User[]);
        }
      }
    };
    fetchUsers();
  }, [isAdmin]);

  const handleChangePassword = async (userId: string) => {
    if (!newPassword) {
      toast({ title: 'Error', description: 'New password cannot be empty.', variant: 'destructive' });
      return;
    }
    const { error } = await supabase.auth.admin.updateUserById(userId, { password: newPassword });
    if (error) {
      toast({ title: 'Error changing password', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Password changed successfully.' });
      setNewPassword('');
    }
  };

  const handleSendMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      toast({ title: 'Error sending magic link', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Magic link sent successfully.' });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold">Loading...</h2>
        <p className="text-gray-600">Checking your administrative privileges.</p>
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
    <div>
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
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button onClick={() => handleChangePassword(user.id)}>Change Password</Button>
                  <Button onClick={() => handleSendMagicLink(user.email)}>Send Magic Link</Button>
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