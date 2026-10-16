import { z } from 'zod';

export const enquirySchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  category: z.string().min(1, 'Please select an enquiry category'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  preferred_contact_method: z.enum(['email', 'phone', 'whatsapp']),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const bookingRequestSchema = z.object({
  facility_id: z.string().min(1, 'Please select a facility'),
  guest_name: z.string().min(2, 'Full name is required'),
  guest_email: z.string().email('Valid email address is required'),
  guest_phone: z.string().min(7, 'Contact phone number is required'),
  organization: z.string().optional(),
  start_time: z.string().min(1, 'Start date and time is required'),
  end_time: z.string().min(1, 'End date and time is required'),
  purpose: z.string().min(5, 'Purpose of reservation is required'),
  attendee_count: z.number().min(1, 'Expected attendance must be at least 1'),
  estimated_price: z.number().min(0),
});

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;

export const membershipApplicationSchema = z.object({
  plan_id: z.string().min(1, 'Please select a membership tier'),
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(7, 'Phone number is required'),
  organization: z.string().optional(),
  emergency_name: z.string().min(2, 'Emergency contact name is required'),
  emergency_phone: z.string().min(7, 'Emergency contact phone is required'),
  emergency_relationship: z.string().min(2, 'Relationship is required'),
});

export type MembershipApplicationInput = z.infer<typeof membershipApplicationSchema>;

export const visitorCheckInSchema = z.object({
  full_name: z.string().min(2, 'Visitor name is required'),
  phone: z.string().optional(),
  email: z.string().email('Valid email required').optional().or(z.literal('')),
  organization: z.string().optional(),
  purpose: z.string().min(3, 'Purpose of visit is required'),
  host_person: z.string().optional(),
  destination: z.string().optional(),
  group_size: z.number().min(1),
  notes: z.string().optional(),
});

export type VisitorCheckInInput = z.infer<typeof visitorCheckInSchema>;

export const paymentRecordSchema = z.object({
  booking_id: z.string().optional(),
  membership_id: z.string().optional(),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  currency: z.string().default('NGN'),
  payment_method: z.enum(['bank_transfer', 'cash', 'pos', 'online_card']),
  payment_date: z.string().min(1, 'Payment date is required'),
  receipt_reference: z.string().min(2, 'Receipt or bank transaction reference is required'),
  notes: z.string().optional(),
});

export type PaymentRecordInput = z.infer<typeof paymentRecordSchema>;

