import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search } from 'lucide-react';

export const BatchmatesPage = () => {
  const [batchmates, setBatchmates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBatchmates, setFilteredBatchmates] = useState([]);
  const { toast } = useToast();

  const fetchBatchmates = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('batchmates').select('*').order('graduation_year', { ascending: false });
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      console.log('Batchmates data:', data);
      setBatchmates(data);
      setFilteredBatchmates(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBatchmates();
  }, []);

  useEffect(() => {
    const results = batchmates.filter(batchmate =>
      batchmate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batchmate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batchmate.graduation_year.toString().includes(searchTerm)
    );
    setFilteredBatchmates(results);
  }, [searchTerm, batchmates]);

  useEffect(() => {
    const results = batchmates.filter(batchmate =>
      batchmate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batchmate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batchmate.graduation_year.toString().includes(searchTerm)
    );
    setFilteredBatchmates(results);
  }, [searchTerm, batchmates]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Our Batchmates</h1>
      <div className="flex items-center space-x-2 mb-6">
        <Input
          type="text"
          placeholder="Search by name, email, or graduation year..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      {loading ? (
        <div>Loading batchmates...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatchmates.map((batchmate) => (
            <Card key={batchmate.id} className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>{batchmate.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-600">Graduation Year: {batchmate.graduation_year}</p>
                <p className="text-sm text-gray-600">Email: {batchmate.email}</p>
                {batchmate.phone && <p className="text-sm text-gray-600">Phone: {batchmate.phone}</p>}
                {batchmate.social_media_links && (
                  <div className="mt-2">
                    <p className="text-sm font-semibold">Social Media:</p>
                    {Object.entries(batchmate.social_media_links).map(([platform, link]) => (
                      <a key={platform} href={link as string} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline block text-sm">
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </a>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};