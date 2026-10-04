import { EmptyState, LinkButton } from '@/components/ui';
import { Rocket } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-lg py-16">
      <EmptyState
        icon={<Rocket size={22} />}
        title="Halaman tidak ditemukan"
        description="Sepertinya kamu tersesat di luar orbit. Kembali ke dashboard untuk melanjutkan."
        action={<LinkButton to="/dashboard">Kembali ke Dashboard</LinkButton>}
      />
    </div>
  );
}
