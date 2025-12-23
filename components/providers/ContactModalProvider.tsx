'use client';

import { ContactModal } from '@/components/layout/ContactModal';
import { useContactModal } from '@/hooks/useContactModal';

export function ContactModalProvider() {
  const { isOpen, close } = useContactModal();
  return <ContactModal isOpen={isOpen} onClose={close} />;
}
