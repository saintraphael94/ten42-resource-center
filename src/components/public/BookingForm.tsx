'use client';

import React, { useState, useId } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Clock, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';
import { bookingRequestSchema, BookingRequestInput } from '@/lib/validations';
import { Facility, Booking } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

interface BookingFormProps {
  facility: Facility;
}

export function BookingForm({ facility }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Form IDs for accessibility
  const dateId = useId();
  const startTimeId = useId();
  const endTimeId = useId();
  const attendeeId = useId();
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const orgId = useId();
  const purposeId = useId();

  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  });
  const [selectedStartTime, setSelectedStartTime] = useState('09:00');
  const [selectedEndTime, setSelectedEndTime] = useState('13:00');

  // Calculate pricing estimate
  const startHours = parseInt(selectedStartTime.split(':')[0], 10);
  const endHours = parseInt(selectedEndTime.split(':')[0], 10);
  const durationHours = Math.max(1, endHours - startHours);

  let calculatedPrice = facility.hourly_rate * durationHours;
  if (durationHours >= 8) {
    calculatedPrice = facility.daily_rate;
  } else if (durationHours >= 4 && facility.half_day_rate > 0) {
    calculatedPrice = facility.half_day_rate;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingRequestSchema),
    defaultValues: {
      facility_id: facility.id,
      attendee_count: Math.min(20, facility.capacity),
      estimated_price: calculatedPrice,
      start_time: `${selectedDate}T${selectedStartTime}:00Z`,
      end_time: `${selectedDate}T${selectedEndTime}:00Z`,
    },
  });

  const onSubmit = async (data: BookingRequestInput) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const start_time = `${selectedDate}T${selectedStartTime}:00Z`;
    const end_time = `${selectedDate}T${selectedEndTime}:00Z`;

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          facility_id: facility.id,
          start_time,
          end_time,
          estimated_price: calculatedPrice,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setErrorMessage(result.error || 'Failed to submit reservation request');
      } else {
        setConfirmedBooking(result.booking);
      }
    } catch {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmedBooking) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Reservation Request Received</h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Your reservation request for <strong>{facility.name}</strong> has been logged in our system. An acknowledgement has been sent to <strong>{confirmedBooking.guest_email}</strong>.
        </p>

        <div className="bg-white border border-emerald-200 rounded-xl p-4 max-w-sm mx-auto my-4 text-left">
          <div className="text-xs text-slate-500 font-medium">Unique Booking Reference:</div>
          <div className="text-lg font-black text-sky-950 tracking-wider">
            {confirmedBooking.booking_reference}
          </div>
          <div className="mt-2 text-xs text-slate-600 flex justify-between">
            <span>Status:</span>
            <span className="font-semibold text-amber-700 uppercase">Pending Review</span>
          </div>
          <div className="text-xs text-slate-600 flex justify-between mt-1">
            <span>Estimated Amount:</span>
            <span className="font-bold text-slate-900">
              {formatCurrency(confirmedBooking.estimated_price)}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Our facilities coordinator will verify schedules and provide official payment invoice instructions.
        </p>

        <div className="pt-2">
          <Button
            variant="outline"
            onClick={() => setConfirmedBooking(null)}
          >
            Submit Another Reservation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start space-x-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Date & Time Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label htmlFor={dateId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Booking Date
          </label>
          <div className="relative">
            <input
              id={dateId}
              type="date"
              value={selectedDate}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
            />
            <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor={startTimeId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Start Time
          </label>
          <div className="relative">
            <select
              id={startTimeId}
              value={selectedStartTime}
              onChange={(e) => setSelectedStartTime(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
            >
              <option value="08:00">08:00 AM</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">01:00 PM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
            </select>
            <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor={endTimeId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            End Time
          </label>
          <div className="relative">
            <select
              id={endTimeId}
              value={selectedEndTime}
              onChange={(e) => setSelectedEndTime(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
            >
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">01:00 PM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
              <option value="17:00">05:00 PM</option>
              <option value="18:00">06:00 PM</option>
            </select>
            <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Price Summary Estimate Card */}
      <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-900 block">
            Estimated Pricing ({durationHours} hours)
          </span>
          <span className="text-xs text-slate-500">
            Buffer: +{facility.setup_buffer_mins}m setup & +{facility.teardown_buffer_mins}m cleanup protected
          </span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-sky-950">{formatCurrency(calculatedPrice)}</div>
          <span className="text-[10px] text-slate-500 font-medium">Standard Institutional Rate</span>
        </div>
      </div>

      {/* Attendee Count & Purpose */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id={attendeeId}
          type="number"
          label={`Expected Attendees (Max: ${facility.capacity})`}
          min={1}
          max={facility.capacity}
          error={errors.attendee_count?.message}
          {...register('attendee_count', { valueAsNumber: true })}
        />
        <Input
          id={orgId}
          label="Organization / Company"
          placeholder="e.g. Apex Health Ltd or Individual"
          error={errors.organization?.message}
          {...register('organization')}
        />
      </div>

      {/* Contact Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          id={nameId}
          label="Contact Full Name"
          placeholder="e.g. Dr. Ngozi Adeleke"
          error={errors.guest_name?.message}
          {...register('guest_name')}
        />
        <Input
          id={emailId}
          type="email"
          label="Email Address"
          placeholder="name@organization.com"
          error={errors.guest_email?.message}
          {...register('guest_email')}
        />
        <Input
          id={phoneId}
          label="Phone Number"
          placeholder="+234 800 000 0000"
          error={errors.guest_phone?.message}
          {...register('guest_phone')}
        />
      </div>

      <Textarea
        id={purposeId}
        label="Purpose of Reservation & Special Setup Requirements"
        placeholder="Please describe the nature of your event, required audiovisual configurations, or seating arrangements..."
        error={errors.purpose?.message}
        {...register('purpose')}
      />

      <div className="pt-2">
        <Button
          type="submit"
          variant="accent"
          size="lg"
          isLoading={isSubmitting}
          className="w-full text-base font-bold shadow-md"
        >
          <ShieldCheck className="w-5 h-5 mr-2" />
          Submit Reservation Request ({formatCurrency(calculatedPrice)})
        </Button>
        <p className="text-center text-xs text-slate-500 mt-2">
          Submitting checks real-time database slot availability and guarantees no double-booking.
        </p>
      </div>
    </form>
  );
}
