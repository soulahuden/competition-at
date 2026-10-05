import { useState } from 'react';
import {
  Button,
  Modal,
  SelectField,
  TextAreaField,
  TextField,
} from '@/components/ui';
import { useStore } from '@/context/StoreContext';
import { benefitOptions, categories, tiers } from './competitionMeta';
import type { CampusBenefit, CompetitionCategory, CompetitionTier } from '@/types';

interface AddCompetitionModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (name: string) => void;
}

const emptyForm = {
  name: '',
  organizer: '',
  category: 'IT' as CompetitionCategory,
  tier: 'Regional' as CompetitionTier,
  description: '',
  registrationDeadline: '2026-11-15',
  startDate: '2026-11-25',
  endDate: '2026-11-27',
  teamSizeMin: 2,
  teamSizeMax: 4,
  fee: 0,
  location: '',
};

export function AddCompetitionModal({ open, onClose, onCreated }: AddCompetitionModalProps) {
  const { createCompetition } = useStore();
  const [form, setForm] = useState(emptyForm);
  const [benefits, setBenefits] = useState<CampusBenefit[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleBenefit = (benefit: CampusBenefit) =>
    setBenefits((list) =>
      list.includes(benefit) ? list.filter((b) => b !== benefit) : [...list, benefit],
    );

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.organizer.trim()) return;
    setSubmitting(true);
    await createCompetition({ ...form, benefits });
    setSubmitting(false);
    setForm(emptyForm);
    setBenefits([]);
    onCreated?.(form.name);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add a competition"
      description="We review it before it shows up in the catalog."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => void handleSubmit()} disabled={submitting}>
            {submitting ? 'Sending…' : 'Submit for review'}
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Competition name"
            required
            placeholder="e.g. Nusantara Hackathon 2026"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
          />
          <TextField
            label="Organizer"
            required
            placeholder="e.g. Computer Science Student Association"
            value={form.organizer}
            onChange={(e) => update('organizer', e.target.value)}
          />
          <SelectField
            label="Category"
            value={form.category}
            onChange={(e) => update('category', e.target.value as CompetitionCategory)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Tier"
            value={form.tier}
            onChange={(e) => update('tier', e.target.value as CompetitionTier)}
          >
            {tiers.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </SelectField>
        </div>

        <TextAreaField
          label="Short description"
          placeholder="Format, theme, and anything participants should know."
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <TextField
            label="Registration deadline"
            type="date"
            value={form.registrationDeadline}
            onChange={(e) => update('registrationDeadline', e.target.value)}
          />
          <TextField
            label="Start date"
            type="date"
            value={form.startDate}
            onChange={(e) => update('startDate', e.target.value)}
          />
          <TextField
            label="End date"
            type="date"
            value={form.endDate}
            onChange={(e) => update('endDate', e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <TextField
            label="Min. team size"
            type="number"
            min={1}
            value={form.teamSizeMin}
            onChange={(e) => update('teamSizeMin', Number(e.target.value))}
          />
          <TextField
            label="Max. team size"
            type="number"
            min={1}
            value={form.teamSizeMax}
            onChange={(e) => update('teamSizeMax', Number(e.target.value))}
          />
          <TextField
            label="Fee (Rp)"
            type="number"
            min={0}
            step={10000}
            hint="Enter 0 if it's free"
            value={form.fee}
            onChange={(e) => update('fee', Number(e.target.value))}
          />
          <TextField
            label="Location"
            placeholder="Online / Jakarta"
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
          />
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">Campus benefits</legend>
          <div className="flex flex-wrap gap-2">
            {benefitOptions.map((benefit) => {
              const active = benefits.includes(benefit);
              return (
                <label
                  key={benefit}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? 'border-emerald-400/50 bg-emerald-400/20 text-emerald-100'
                      : 'border-white/15 bg-white/5 text-ink-muted hover:text-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={active}
                    onChange={() => toggleBenefit(benefit)}
                  />
                  {benefit}
                </label>
              );
            })}
          </div>
        </fieldset>
      </form>
    </Modal>
  );
}
