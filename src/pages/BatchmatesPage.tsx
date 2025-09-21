import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer'; // new import

// Common animation variants for uniform transitions
const pageVariants = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	exit: { opacity: 0, y: -20, transition: { duration: 0.5 } }
};

const headerVariants = {
	initial: { scale: 0.8, opacity: 0 },
	animate: { scale: 1, opacity: 1, transition: { duration: 0.6 } }
};

export const BatchmatesPage = () => {
	const [batchmates, setBatchmates] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [filteredBatchmates, setFilteredBatchmates] = useState([]);
	const { toast } = useToast();

	// New states for joining batch
	const [newName, setNewName] = useState('');
	const [newGraduationYear, setNewGraduationYear] = useState('');
	const [newEmail, setNewEmail] = useState('');
	const [newPhone, setNewPhone] = useState('');
	const [newPhoto, setNewPhoto] = useState(null);

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

	// New: handle joining batchmates automatically with photo upload
	const handleJoinBatch = async (e) => {
		e.preventDefault();
		if (!newName.trim() || !newGraduationYear || !newEmail.trim()) {
			toast({
				title: 'Validation Error',
				description: 'Name, graduation year, and email are required.',
				variant: 'destructive'
			});
			return;
		}
		// Upload photo if provided
		let photoUrl = null;
		if (newPhoto) {
			const fileExt = newPhoto.name.split('.').pop();
			const fileName = `${Date.now()}.${fileExt}`;
			const filePath = `photos/${fileName}`;
			const { data: uploadData, error: uploadError } = await supabase
				.storage
				.from('batchmate-photos')
				.upload(filePath, newPhoto);
			if (uploadError) {
				toast({
					title: 'Photo Upload Error',
					description: uploadError.message,
					variant: 'destructive'
				});
				return;
			}
			const { data: publicUrlData } = supabase
				.storage
				.from('batchmate-photos')
				.getPublicUrl(uploadData.path);
			photoUrl = publicUrlData.publicUrl;
		}
		const response = await supabase.from('batchmates').insert([{
			name: newName,
			graduation_year: Number(newGraduationYear),
			email: newEmail,
			phone: newPhone || null,
			photo_url: photoUrl
		}]);
		if (response.error) {
			toast({
				title: 'Error',
				description: response.error.message,
				variant: 'destructive'
			});
		} else {
			toast({
				title: 'Success',
				description: 'You have joined your batch.'
			});
			setNewName('');
			setNewGraduationYear('');
			setNewEmail('');
			setNewPhone('');
			setNewPhoto(null);
			fetchBatchmates();
		}
	};

	return (
		<PageContainer>
			{/* Existing Header */}
			<header className="mb-10 text-center">
				<h1 className="text-3xl font-bold">Our Batchmates</h1>
			</header>
      
			{/* Existing Join Form */}
			<div className="mb-6">
				<h2 className="text-xl font-semibold mb-2">Join Your Batch</h2>
				<form onSubmit={handleJoinBatch} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
					<Input placeholder="Your Name" value={newName} onChange={(e) => setNewName(e.target.value)} />
					<Input type="number" placeholder="Graduation Year" value={newGraduationYear} onChange={(e) => setNewGraduationYear(e.target.value)} />
					<Input type="email" placeholder="Your Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
					<Input placeholder="Your Phone (optional)" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
					<Input type="file" accept="image/*" onChange={(e) => setNewPhoto(e.target.files ? e.target.files[0] : null)} />
					<Button type="submit">Join</Button>
				</form>
			</div>
      
			{/* Existing Search Bar */}
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
      
			{/* Existing Content */}
			{loading ? (
				<div className="flex justify-center items-center">
					<div>Loading batchmates...</div>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredBatchmates.map((batchmate) => (
						<Card key={batchmate.id} className="h-full flex flex-col">
							<CardHeader>
								<CardTitle>{batchmate.name}</CardTitle>
							</CardHeader>
							<CardContent className="flex-grow">
								{batchmate.photo_url && (
									<img src={batchmate.photo_url} alt={`${batchmate.name}'s photo`} className="mb-2 w-full h-auto object-cover" />
								)}
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
		</PageContainer>
	);
};