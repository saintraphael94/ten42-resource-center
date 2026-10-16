import React from 'react';
import { Settings, Building, Clock, Globe, Shield, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/data/store';


export default async function AdminSettingsPage() {
  const settings = await db.getSettings();
  const general = (settings.general_info as Record<string, string>) || {};
  const bank = (settings.bank_details as Record<string, string>) || {};

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">System Configuration & Institution Settings</h2>
        <p className="text-xs text-slate-500">
          Manage institutional metadata, timezone, currency rules, and bank settlement instructions
        </p>
      </div>

      {/* Institutional Profile */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-4">
          <Building className="w-5 h-5 text-sky-800" />
          <h3 className="font-bold text-slate-900 text-sm">Institutional Identity & Contact Info</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          <div>
            <span className="text-slate-400 block font-semibold uppercase tracking-wider">Institution Name</span>
            <span className="font-bold text-slate-900 block mt-1 text-sm">
              {general.center_name || 'Ten42 Training and Resource Center'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-semibold uppercase tracking-wider">Official Motto / Tagline</span>
            <span className="font-semibold text-orange-600 italic block mt-1">
              &quot;{general.tagline || 'Training for Right Living...'}&quot;
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-semibold uppercase tracking-wider">Physical Address</span>
            <span className="font-medium text-slate-800 block mt-1">
              {general.address || 'Plot 1042 Commercial Layout, Victoria Island, Lagos, Nigeria'}
            </span>
            <Badge variant="outline" className="mt-1 text-[10px]">Editable via Admin</Badge>
          </div>

          <div>
            <span className="text-slate-400 block font-semibold uppercase tracking-wider">Front Desk Phone & Email</span>
            <span className="font-medium text-slate-800 block mt-1">
              {general.phone || '+234 800 000 1042'} | {general.email || 'info@ten42.org'}
            </span>
          </div>
        </div>
      </div>

      {/* Regional & Localization Parameters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-4">
          <Globe className="w-5 h-5 text-sky-800" />
          <h3 className="font-bold text-slate-900 text-sm">Regional & Localization Parameters</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          <div>
            <span className="text-slate-400 block font-semibold uppercase tracking-wider">Primary System Timezone</span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="font-mono font-bold text-sky-950 text-sm">
                {general.timezone || 'Africa/Lagos'}
              </span>
              <Badge variant="success">GMT+1</Badge>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              All reservation conflict checks and timestamps calculate based on Lagos local time.
            </p>
          </div>

          <div>
            <span className="text-slate-400 block font-semibold uppercase tracking-wider">Standard Currency</span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="font-bold text-sky-950 text-sm">
                Nigerian Naira ({general.currency || 'NGN'} ₦)
              </span>
              <Badge variant="primary">Exact Decimal / Integer Minor Unit</Badge>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Monetary values stored to zero floating-point loss.
            </p>
          </div>
        </div>
      </div>

      {/* Official Bank Account Settlement */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-4">
          <CreditCard className="w-5 h-5 text-sky-800" />
          <h3 className="font-bold text-slate-900 text-sm">Verified Banking Information for Wire Transfers</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
          <div>
            <span className="text-slate-400 block font-semibold uppercase tracking-wider">Designated Bank</span>
            <span className="font-bold text-slate-900 block mt-1">{bank.bank_name || 'Zenith Bank Plc'}</span>
          </div>

          <div>
            <span className="text-slate-400 block font-semibold uppercase tracking-wider">Account Name</span>
            <span className="font-bold text-slate-900 block mt-1">
              {bank.account_name || 'Ten42 Training and Resource Center Ltd'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-semibold uppercase tracking-wider">Account Number</span>
            <span className="font-mono font-black text-sky-950 block mt-1 text-sm">
              {bank.account_number || '1042000000'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
