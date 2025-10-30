import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function ContactPage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const PUBLIC = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // init EmailJS once
  try { if (PUBLIC) emailjs.init(PUBLIC); } catch(e){ console.warn(e); }

  async function onSubmit(e){
    e.preventDefault();
    setLoading(true);
    setStatus('');
    const form = new FormData(e.target);
    const payload = Object.fromEntries(form.entries());
    payload.source = 'Contact Page';

    try {
      if (SERVICE && TEMPLATE) {
        await emailjs.send(SERVICE, TEMPLATE, payload);
        setStatus('Thanks — we received your message.');
        e.target.reset();
      } else {
        // simulate and instruct
        setStatus('Demo mode: EmailJS not configured. Replace env vars to enable sending.');
        console.info('Email payload:', payload);
      }
    } catch(err){
      setStatus('Failed to send. Try again or call us.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-3">Contact Us</h1>
      <p className="text-sm text-gray-600 mb-4">Fill the form and we’ll contact you.</p>

      <form onSubmit={onSubmit} className="card p-6 space-y-3">
        <input name="user_name" placeholder="Full name" required className="w-full px-3 py-2 rounded border" />
        <input name="user_phone" placeholder="Mobile (e.g. +91...)" required className="w-full px-3 py-2 rounded border" />
        <input name="user_email" placeholder="Email" className="w-full px-3 py-2 rounded border" />
        <select name="interest" className="w-full px-3 py-2 rounded border">
          <option value="">I'm interested in...</option>
          <option>Health Insurance</option>
          <option>Term Life</option>
          <option>Compare Plans</option>
        </select>
        <textarea name="message" placeholder="Short note" className="w-full px-3 py-2 rounded border" />
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">We respect your privacy.</div>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</button>
        </div>
        {status && <div className="text-sm mt-2">{status}</div>}
      </form>
    </main>
  );
}
