import { EmptyState, LinkButton } from '@/components/ui';
import { Rocket } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-lg py-16">
      <EmptyState
        icon={<Rocket size={22} />}
        title="Page not found"
        action={<LinkButton to="/dashboard">Back to dashboard</LinkButton>}
      />
    </div>
  );
}
