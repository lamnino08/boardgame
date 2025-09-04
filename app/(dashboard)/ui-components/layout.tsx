'use client';

import Card from '@/components/ui/Card';
import { usePathname, useRouter } from 'next/navigation';

const DEMOS = [
  { key: 'button', label: 'Button', path: '/ui-components/button' },
  { key: 'input', label: 'Form', path: '/ui-components/form/components' },
  { key: 'builder', label: 'Form Builder', path: '/ui-components/form/builder' },
  { key: 'table', label: 'Table', path: '/ui-components/table' },
  { key: 'datalistview', label: 'Data List View', path: '/ui-components/data-list-view' },
  { key: 'toast', label: 'Toast', path: '/ui-components/alert' },
  { key: 'badge', label: 'Badge', path: '/ui-components/badge' },
  { key: 'carousel', label: 'Carousel', path: '/ui-components/carousel' },
  { key: 'modal', label: 'Modal', path: '/ui-components/modal' },
  { key: 'tab', label: 'Tab', path: '/ui-components/tab' },
];

export default function Page({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gradient-start via-gradient-mid to-gradient-end flex flex-col items-center justify-start p-6">
      <Card className="w-full max-w-4xl p-6 bg-white/10 backdrop-blur-lg shadow-lg rounded-2xl">
        {/* Tab Navigation */}
        <div className="flex gap-3 mb-8 overflow-x-auto scrollbar-hide pb-2 border-b border-white/10">
          {DEMOS.map((demo) => {
            const active = pathname === demo.path;
            return (
              <button
                key={demo.key}
                onClick={() => router.push(demo.path)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300
                  ${
                    active
                      ? 'bg-gradient-to-r from-brand to-brand-light text-white shadow-lg scale-105'
                      : 'bg-neutral-900/60 text-gray-300 hover:bg-neutral-800 hover:text-white'
                  }
                `}
              >
                {demo.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-4 bg-neutral-900/40 rounded-xl shadow-inner min-h-[300px]">
          {children}
        </div>
      </Card>
    </div>
  );
}
