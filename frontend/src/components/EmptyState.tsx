import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
      <div className="w-12 h-12 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        <Icon className="w-6 h-6 text-gray-400" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-black bg-[#C8F135] rounded-lg hover:bg-[#b8e02d] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8F135]"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}