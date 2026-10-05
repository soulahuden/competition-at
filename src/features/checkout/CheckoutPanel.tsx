import { useState } from 'react';
import { CheckCircle2, CreditCard, QrCode, Smartphone, Wallet } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { formatRupiah } from '@/lib/format';
import { platformFeeRate } from '@/data/organizers';
import type { Competition } from '@/types';

const methods = [
  { id: 'QRIS', label: 'QRIS', hint: 'Scan with any bank or e-wallet app', icon: QrCode },
  { id: 'Virtual Account', label: 'Virtual Account', hint: 'BCA · Mandiri · BNI · BRI', icon: CreditCard },
  { id: 'E-Wallet', label: 'E-Wallet', hint: 'GoPay · OVO · DANA · ShopeePay', icon: Smartphone },
];

interface CheckoutPanelProps {
  competition: Competition;
  teamName: string;
  memberCount: number;
  onPaid: (method: string) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
}

/**
 * Checkout mock: hanya tampilan. Tidak ada integrasi pembayaran apa pun,
 * status langsung berpindah ke "Pembayaran berhasil".
 */
export function CheckoutPanel({
  competition,
  teamName,
  memberCount,
  onPaid,
  onCancel,
  submitLabel = 'Pay now',
}: CheckoutPanelProps) {
  const [method, setMethod] = useState(methods[0].id);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const adminFee = 5000;
  const total = competition.fee + adminFee;
  const platformCut = Math.round(competition.fee * platformFeeRate);

  const handlePay = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 900));
    await onPaid(method);
    setProcessing(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <span className="rounded-2xl border border-emerald-400/30 bg-emerald-400/15 p-3 text-emerald-200">
          <CheckCircle2 size={28} />
        </span>
        <div>
          <p className="font-display text-lg font-semibold text-white">Payment received</p>
          <p className="mt-1 text-sm text-ink-muted">
            <span className="text-white">{teamName}</span> is registered for {competition.name}.
          </p>
        </div>
        <Badge tone="success">Paid via {method}</Badge>
        <p className="text-xs text-ink-faint">A receipt was sent to your campus email.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-wide text-ink-faint">Breakdown</p>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-muted">
              Team registration · {competition.name}
            </dt>
            <dd className="text-ink">{formatRupiah(competition.fee)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-muted">Service fee</dt>
            <dd className="text-ink">{formatRupiah(adminFee)}</dd>
          </div>
          <div className="flex justify-between gap-4 text-xs text-ink-faint">
            <dt>Includes COM@T platform fee ({Math.round(platformFeeRate * 100)}%)</dt>
            <dd>{formatRupiah(platformCut)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-white/10 pt-2 font-semibold">
            <dt className="text-white">Total</dt>
            <dd className="text-cyan-soft">{formatRupiah(total)}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-ink-faint">
          {memberCount} members · {teamName}
        </p>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">Payment method</legend>
        <div className="space-y-2">
          {methods.map((m) => {
            const Icon = m.icon;
            const active = method === m.id;
            return (
              <label
                key={m.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${
                  active
                    ? 'border-cyan/60 bg-cyan/10'
                    : 'border-white/10 bg-white/5 hover:border-white/25'
                }`}
              >
                <input
                  type="radio"
                  name="metode-bayar"
                  value={m.id}
                  checked={active}
                  onChange={() => setMethod(m.id)}
                  className="sr-only"
                />
                <span className={active ? 'text-cyan-soft' : 'text-ink-muted'}>
                  <Icon size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-white">{m.label}</span>
                  <span className="block text-xs text-ink-muted">{m.hint}</span>
                </span>
                <span
                  className={`h-4 w-4 shrink-0 rounded-full border ${
                    active ? 'border-cyan bg-cyan' : 'border-white/30'
                  }`}
                  aria-hidden="true"
                />
              </label>
            );
          })}
        </div>
      </fieldset>

      <p className="flex items-start gap-2 rounded-xl border border-amber/25 bg-amber/10 p-3 text-xs text-amber-soft">
        <Wallet size={15} className="mt-0.5 shrink-0" />
        This is a prototype. No real payment is made.
      </p>

      <div className="flex flex-wrap justify-end gap-3">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Not now
          </Button>
        )}
        <Button onClick={() => void handlePay()} disabled={processing}>
          {processing ? 'Processing…' : `${submitLabel} · ${formatRupiah(total)}`}
        </Button>
      </div>
    </div>
  );
}
