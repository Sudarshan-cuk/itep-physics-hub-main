import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ProfileForm } from '@/components/user/ProfileForm';
import { SocialAccountsForm } from '@/components/user/SocialAccountsForm.tsx';
import { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

export default function MyAccount() {
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        toast({
          title: 'Error',
          description: `Failed to fetch profile: ${error.message}`,
          variant: 'destructive',
        });
      } else {
        setUserProfile(data);
      }
    }
    setLoading(false);
  };

  const handleProfileUpdateSuccess = () => {
    toast({
      title: 'Success',
      description: 'Profile updated successfully.',
    });
    fetchUserProfile(); // Re-fetch profile to show updated data
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">Loading profile...</div>
    );
  }

  if (!userProfile) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">Please log in to view your account.</div>
    );
  }

  return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">My Account</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="social-accounts">Social Accounts</TabsTrigger>
              </TabsList>
              <TabsContent value="profile">
                <ProfileForm profile={userProfile} onSuccess={handleProfileUpdateSuccess} />
              </TabsContent>
              <TabsContent value="social-accounts">
                <SocialAccountsForm userId={userProfile.user_id} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
  );
}
