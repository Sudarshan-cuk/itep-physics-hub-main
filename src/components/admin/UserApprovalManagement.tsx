import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'student';
  is_approved: boolean;
}

export const UserApprovalManagement: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: profiles, isLoading, error } = useQuery<Profile[]>({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_approved', false);
      if (error) throw error;
      return data;
    },
  });

  const approveUserMutation = useMutation({
    mutationFn: async ({ id, is_approved }: { id: string; is_approved: boolean }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_approved })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success('User approval status updated successfully.');
    },
    onError: (err) => {
      toast.error(`Failed to update user approval status: ${err.message}`);
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading profiles: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">User Approval Management</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Approved</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles?.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell>{profile.full_name}</TableCell>
              <TableCell>{profile.email}</TableCell>
              <TableCell>{profile.role}</TableCell>
              <TableCell>
                <Switch
                  checked={profile.is_approved}
                  onCheckedChange={(checked) =>
                    approveUserMutation.mutate({ id: profile.id, is_approved: checked })
                  }
                  disabled={approveUserMutation.isPending}
                />
              </TableCell>
              <TableCell>
                {/* Additional actions can be added here if needed */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};