'use client'

import { useRouter } from 'next/navigation';
import { Card, CardTitle } from '@/components/ui/Card'; // chỉnh path nếu cần

interface CardLinkProps {
  title: string;
  content: string;
  subtext: string;
  href: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const CardLink: React.FC<CardLinkProps> = ({
  title,
  content,
  subtext,
  href,
  align = 'center',
  className,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
  };

  return (
    <Card onClick={handleClick} className={`hover:scale-[1.02] cursor-pointer ${className}`}>
      <CardTitle align={align} title={title} />
      <p className="text-xl font-bold mt-2">{content}</p>
      <p className="text-sm text-text-secondary mt-1">{subtext}</p>
    </Card>
  );
};
