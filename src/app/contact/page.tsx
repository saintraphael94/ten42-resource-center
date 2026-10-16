'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicFooter } from '@/components/public/PublicFooter';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { enquirySchema, EnquiryInput } from '@/lib/validations';
import { Enquiry } from '@/types/database';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<Enquiry | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      category: 'general_enquiry',
      preferred_contact_method: 'email' as const,
    },
  });

  const onSubmit = async (data: EnquiryInput) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        setErrorMessage(result.error || 'Failed to submit enquiry');
      } else {
        setSubmittedEnquiry(result.enquiry);
        reset();
      }
    } catch {
      setErrorMessage('Network error occurred. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />

      <main className="flex-grow bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <Badge variant="accent">Contact & Enquiries Desk</Badge>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mt-3">
              We&apos;re Here to Assist You
            </h1>
            <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
              Have questions regarding facility rentals, corporate training packages, partnerships, or membership applications? Send us a message and our administrative team will respond promptly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Contact Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200/90 shadow-xs">
              {submittedEnquiry ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Message Delivered</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Thank you, <strong>{submittedEnquiry.full_name}</strong>. Your enquiry has been routed to our front desk team.
                  </p>
                  <div className="p-3 bg-white border border-emerald-200 rounded-xl inline-block font-mono text-sm font-bold text-sky-950">
                    Enquiry Reference: {submittedEnquiry.reference}
                  </div>
                  <div className="pt-4">
                    <Button variant="outline" onClick={() => setSubmittedEnquiry(null)}>
                      Send Another Message
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {errorMessage && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      placeholder="e.g. Kolawole Adebayo"
                      error={errors.full_name?.message}
                      {...register('full_name')}
                    />
                    <Input
                      type="email"
                      label="Email Address"
                      placeholder="name@organization.com"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Phone Number (Optional)"
                      placeholder="+234 800 000 0000"
                      error={errors.phone?.message}
                      {...register('phone')}
                    />
                    <Select
                      label="Enquiry Category"
                      error={errors.category?.message}
                      {...register('category')}
                    >
                      <option value="facility_booking">Facility & Hall Reservation</option>
                      <option value="training_program">Training & Masterclasses</option>
                      <option value="membership">Membership Plans & Privileges</option>
                      <option value="partnership">Institutional Partnership</option>
                      <option value="general_enquiry">General Enquiry</option>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Subject"
                      placeholder="Summary of your inquiry"
                      error={errors.subject?.message}
                      {...register('subject')}
                    />
                    <Select
                      label="Preferred Contact Channel"
                      {...register('preferred_contact_method')}
                    >
                      <option value="email">Email Response</option>
                      <option value="phone">Phone Call</option>
                      <option value="whatsapp">WhatsApp Message</option>
                    </Select>
                  </div>

                  <Textarea
                    label="Detailed Message"
                    placeholder="Please specify dates, attendee estimates, or specific questions..."
                    error={errors.message?.message}
                    {...register('message')}
                  />

                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    isLoading={isSubmitting}
                    className="w-full font-bold shadow-md"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Enquiry
                  </Button>
                </form>
              )}
            </div>

            {/* Verified Location & Details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-sky-950 text-white p-8 rounded-2xl space-y-6 border border-sky-900 shadow-sm">
                <div>
                  <Badge variant="accent">Institutional Address</Badge>
                  <h3 className="text-xl font-bold mt-2">Ten42 Center</h3>
                  <p className="text-xs text-sky-200 italic mt-0.5">&quot;Training for Right Living...&quot;</p>
                </div>

                <div className="space-y-4 text-sm text-slate-300">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white">Physical Location</strong>
                      <span>Plot 1042 Commercial Layout, Victoria Island, Lagos, Nigeria</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white">Telephone & Inquiries</strong>
                      <span>+234 800 000 1042</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white">Official Email</strong>
                      <span>info@ten42.org</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white">Front Desk Hours</strong>
                      <span>Monday – Friday: 8:00 AM – 6:00 PM</span>
                      <span className="block text-xs text-slate-400">Saturday: 9:00 AM – 5:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Verification Notice */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <span className="font-bold text-slate-900 block">Bank Transfer Instructions</span>
                <p>
                  Official payments for facility reservations and memberships must be made exclusively to the official Ten42 Zenith Bank account. We never solicit payments into personal accounts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
