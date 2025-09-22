import { Metadata } from 'next';
import ContactClient from './contact-client';

export const metadata: Metadata = {
  title: 'Contact Us',
};

export default function ContactPage() {
  return <ContactClient />;
}
