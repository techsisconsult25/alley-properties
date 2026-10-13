'use client';
import { trackWhatsAppLead } from '@/lib/track';
import { whatsappLink } from '@/lib/utils';
import { FaWhatsapp } from 'react-icons/fa';

type Props = {
  listing?: { title: string; slug: string };
  label?: string;
  size?: 'sm' | 'lg';
  className?: string;
};

export default function WhatsAppButton({
  listing,
  label = 'Chat on WhatsApp',
  size = 'lg',
  className = '',
}: Props) {
  const pad = size === 'sm' ? 'px-3 py-2 text-xs' : 'px-5 py-3 text-sm';
  return (
    <a
      href={whatsappLink(listing)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppLead(listing?.title)}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp font-semibold text-white transition hover:brightness-110 ${pad} ${className}`}
    >
      <FaWhatsapp className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
      {label}
    </a>
  );
}
