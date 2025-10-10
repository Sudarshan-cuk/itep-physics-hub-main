import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { toast } from '../ui/use-toast';
import { Tables, TablesInsert, TablesUpdate } from '../../integrations/supabase/types';

type SiteStatistic = Tables<'site_statistics'>;
type SiteStatisticInsert = TablesInsert<'site_statistics'>;
type SiteStatisticUpdate = TablesUpdate<'site_statistics'>;
import { icons, LucideProps } from 'lucide-react'; // Import specific icons object and LucideProps
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import React from 'react';

const formSchema = z.object({
  label: z.string().min(2, { message: 'Label must be at least 2 characters.' }),
  display_value: z.string().min(1, { message: 'Display value cannot be empty.' }),
  icon_name: z.string().min(1, { message: 'Icon name cannot be empty.' }),
});

type SiteStatisticsFormProps = {
  statistic?: SiteStatistic | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export const SiteStatisticsForm = ({ statistic, onSuccess, onCancel }: SiteStatisticsFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: statistic?.label || '',
      display_value: statistic?.display_value || '',
      icon_name: statistic?.icon_name || '',
    },
  });

  useEffect(() => {
    if (statistic) {
      form.reset({
        label: statistic.label,
        display_value: statistic.display_value,
        icon_name: statistic.icon_name,
      });
    } else {
      form.reset({
        label: '',
        display_value: '',
        icon_name: '',
      });
    }
  }, [statistic, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let error = null;
    if (statistic) {
      // Update existing statistic
      const updatePayload: SiteStatisticUpdate = values;
      const { error: updateError } = await supabase
        .from('site_statistics')
        .update(updatePayload)
        .eq('id', statistic.id);
      error = updateError;
    } else {
      // Insert new statistic
      const insertPayload: SiteStatisticInsert = {
        label: values.label,
        display_value: values.display_value,
        icon_name: values.icon_name,
      };
      const { error: insertError } = await supabase.from('site_statistics').insert(insertPayload);
      error = insertError;
    }

    if (error) {
      toast({
        title: 'Error saving statistic',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Statistic saved',
        description: 'The site statistic has been successfully saved.',
      });
      onSuccess();
    }
  };

  // Get all icon names from LucideIcons
  const lucideIconNames = Object.keys(icons).filter(name => name !== 'createReactComponent');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="display_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Value</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {lucideIconNames.map((iconName) => {
                    const IconComponent = icons[iconName as keyof typeof icons];
                    return (
                      <SelectItem key={iconName} value={iconName}>
                        <div className="flex items-center">
                          {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
                          {iconName}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {statistic ? 'Save Changes' : 'Add Statistic'}
          </Button>
        </div>
      </form>
    </Form>
  );
};