'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicFooter } from '@/components/public/PublicFooter';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/utils';
import { MembershipPlan } from '@/types/database';
import { membershipApplicationSchema, MembershipApplicationInput } from '@/lib/validations';

export default function MembershipPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState<{
    membershipNumber: string;
    planName: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/plans')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPlans(data);
      })
      .catch(() => {});
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<MembershipApplicationInput>({
    resolver: zodResolver(membershipApplicationSchema),
  });

  const handleOpenApplication = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    setValue('plan_id', plan.id);
    setIsModalOpen(true);
    setApplicationSuccess(null);
  };

  const onSubmit = async (data: MembershipApplicationInput) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/memberships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        setApplicationSuccess({
          membershipNumber: result.membership.membership_number,
          planName: selectedPlan?.name || 'Selected Tier',
        });
        reset();
      }
    } catch {
      alert('Application failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />

      <main className="flex-grow bg-slate-50">
        {/* Banner */}
        <section className="bg-sky-950 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <Badge variant="accent">Ten42 Community</Badge>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-3">
                Membership Plans & Benefits
              </h1>
              <p className="text-slate-300 mt-3 text-base sm:text-lg leading-relaxed">
                Connect with an inspiring network of executives, professionals, and lifelong learners. Enjoy meeting room allocations, substantial facility discounts, and exclusive events.
              </p>
            </div>
          </div>
        </section>

        {/* Plans Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <Badge variant="primary" className="mb-3">
                      {plan.code}
                    </Badge>
                    <h2 className="text-xl font-bold text-slate-900">{plan.name}</h2>
                    <p className="text-xs text-slate-500 mt-2 min-h-[50px] leading-relaxed">
                      {plan.description}
                    </p>

                    <div className="my-6 pt-5 border-t border-slate-100">
                      <div className="text-3xl font-black text-sky-950">
                        {formatCurrency(plan.fee)}
                      </div>
                      <span className="text-xs text-slate-400 font-medium">per month (billed monthly)</span>
                    </div>

                    <div className="space-y-3 pt-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                        Included Privileges
                      </span>
                      <ul className="space-y-2.5 text-xs text-slate-600">
                        {plan.benefits.map((b, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-5 border-t border-slate-100">
                    <Button
                      variant="accent"
                      className="w-full font-bold shadow-xs"
                      onClick={() => handleOpenApplication(plan)}
                    >
                      Apply for Tier <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Application Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={applicationSuccess ? 'Application Submitted' : `Apply: ${selectedPlan?.name}`}
        description={
          applicationSuccess
            ? 'Your membership enrollment has been initiated'
            : 'Please complete the membership registration form below'
        }
      >
        {applicationSuccess ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Application Received</h4>
            <p className="text-xs text-slate-600">
              Your prospective membership for <strong>{applicationSuccess.planName}</strong> has been assigned reference:
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-base font-bold text-sky-950">
              {applicationSuccess.membershipNumber}
            </div>
            <p className="text-xs text-slate-500">
              Our membership committee verifies documentation within 24 hours. You will receive an email containing official bank invoice details.
            </p>
            <Button variant="primary" onClick={() => setIsModalOpen(false)} className="w-full">
              Close Window
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Babatunde Fashola"
              error={errors.full_name?.message}
              {...register('full_name')}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="email"
                label="Email Address"
                placeholder="name@domain.com"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Phone Number"
                placeholder="+234 800 000 0000"
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>
            <Input
              label="Organization / Affiliation (Optional)"
              placeholder="Company or Institution"
              error={errors.organization?.message}
              {...register('organization')}
            />

            <div className="pt-3 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Emergency Contact
              </span>
              <div className="space-y-3">
                <Input
                  label="Contact Name"
                  placeholder="Full name of next of kin"
                  error={errors.emergency_name?.message}
                  {...register('emergency_name')}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Contact Phone"
                    placeholder="+234..."
                    error={errors.emergency_phone?.message}
                    {...register('emergency_phone')}
                  />
                  <Input
                    label="Relationship"
                    placeholder="e.g. Spouse / Sibling / Parent"
                    error={errors.emergency_relationship?.message}
                    {...register('emergency_relationship')}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                variant="accent"
                isLoading={isSubmitting}
                className="w-full font-bold"
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Submit Membership Application
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <PublicFooter />
    </div>
  );
}

