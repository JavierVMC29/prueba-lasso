import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { CreateGrantsDto } from "@src/modules/grants/domain/dtos/create-grants.dto";

import { Button } from "@src/components/Button";
import { TextArea } from "@src/components/TextArea";
import { TextInput } from "@src/components/TextInput";

// Zod schema for a single grant
const singleGrantSchema = z.object({
  name: z.string().min(1, "Grant name is required"),
  description: z.string().min(1, "Description is required"),
});

// Zod schema for the manual form (array of grants)
const manualFormSchema = z.object({
  grants: z.array(singleGrantSchema).min(1, "At least one grant is required"),
});

type ManualFormData = z.infer<typeof manualFormSchema>;

interface Props {
  isLoading: boolean;
  onSubmit: (data: CreateGrantsDto) => Promise<boolean>; // Returns promise for reset
}

export const ManualGrantsForm: React.FC<Props> = ({ isLoading, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<ManualFormData>({
    resolver: zodResolver(manualFormSchema),
    defaultValues: {
      grants: [{ name: "", description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "grants",
  });

  // Submit handler for the manual form
  const onManualSubmit = async (data: ManualFormData) => {
    // data.grants is already in the correct CreateGrantsDto format
    const success = await onSubmit(data.grants);
    if (success) {
      // Reset form only if submission was successful
      reset({ grants: [{ name: "", description: "" }] });
    }
  };

  return (
    <form onSubmit={handleSubmit(onManualSubmit)} className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border border-slate-200 rounded-lg space-y-4 relative">
          <h3 className="font-medium text-slate-600">Grant #{index + 1}</h3>
          <TextInput
            data-testid={`grant-name-${index}`}
            id={`name_${index}`}
            label="Grant Name"
            type="text"
            placeholder="e.g., Sustainable Agriculture Research Grant"
            disabled={isLoading}
            {...register(`grants.${index}.name`)}
            error={errors.grants?.[index]?.name}
          />

          <TextArea
            data-testid={`grant-description-${index}`}
            id={`grant_description_${index}`}
            label="Grant Description"
            rows={4}
            placeholder="Funding for projects that promote organic farming..."
            disabled={isLoading}
            {...register(`grants.${index}.description`)}
            error={errors.grants?.[index]?.description}
          />

          {fields.length > 1 && (
            <Button data-testid={`remove-grant-${index}`} type="button" variant="danger" onClick={() => remove(index)} className="absolute top-3 right-3 !w-auto !p-2" aria-label={`Remove Grant #${index + 1}`}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}

      {/* Add/Submit Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button data-testid="add-grant-button" type="button" variant="light" onClick={() => append({ name: "", description: "" })} disabled={isLoading} className="w-full" icon={<Plus className="w-4 h-4" />}>
          Add Another Grant
        </Button>
        <Button data-testid="submit-manual-button" type="submit" variant="primary" disabled={isLoading} className="w-full">
          {isLoading ? "Submitting..." : `Submit ${fields.length} Grant(s)`}
        </Button>
      </div>
    </form>
  );
};
