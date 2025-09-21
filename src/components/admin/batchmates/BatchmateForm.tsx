import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const BatchmateForm = ({ batchmate, onSuccess }) => {
	const [name, setName] = useState(batchmate ? batchmate.name : '');
	const [batchYear, setBatchYear] = useState(batchmate ? batchmate.batch_year : '');
	const { toast } = useToast();

	useEffect(() => {
		if (batchmate) {
			setName(batchmate.name);
			setBatchYear(batchmate.batch_year);
		}
	}, [batchmate]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!name || !batchYear) {
			toast({
				title: 'Validation Error',
				description: 'Both name and batch year are required.',
				variant: 'destructive'
			});
			return;
		}

		let response;
		if (batchmate) {
			// Update existing batchmate
			response = await supabase.from('batchmates').update({ name, batch_year: batchYear }).eq('id', batchmate.id);
		} else {
			// Automatically add new batchmate when batch year is provided.
			// You must provide all required fields, e.g. email, and use the correct property names
			response = await supabase.from('batchmates').insert([{
				name,
				graduation_year: batchYear,
				email: batchmate?.email || '', // Provide a value or add an email input field
			}]);
		}

		if (response.error) {
			toast({
				title: 'Error',
				description: response.error.message,
				variant: 'destructive'
			});
		} else {
			toast({
				title: 'Success',
				description: batchmate ? 'Batchmate updated.' : 'Batchmate created.'
			});
			onSuccess();
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label>Name</label>
				<input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter batchmate name" className="input" />
			</div>
			<div>
				<label>Batch Year</label>
				<input type="number" value={batchYear} onChange={(e) => setBatchYear(e.target.value)} placeholder="Enter batch year" className="input" />
			</div>
			<button type="submit" className="button">{batchmate ? 'Update' : 'Create'}</button>
		</form>
	);
};