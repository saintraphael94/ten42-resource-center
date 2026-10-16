import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap, Calendar, Users, MapPin, Award } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { db } from '@/lib/data/store';


export default async function AdminProgramsPage() {
  const programs = await db.getPrograms();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Programs & Masterclasses</h2>
          <p className="text-xs text-slate-500">
            Manage executive curriculums, instructors, capacities, and enrollment fees
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="p-4">Program Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Facilitator</th>
                <th className="p-4">Dates</th>
                <th className="p-4">Venue</th>
                <th className="p-4">Capacity</th>
                <th className="p-4">Fee (NGN)</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {programs.map((prog) => (
                <tr key={prog.id} className="hover:bg-slate-50/60">
                  <td className="p-4 font-bold text-slate-900">{prog.title}</td>
                  <td className="p-4">
                    <Badge variant="primary">{prog.category}</Badge>
                  </td>
                  <td className="p-4 text-slate-700">{prog.instructor}</td>
                  <td className="p-4 text-slate-600">
                    {prog.start_date} – {prog.end_date}
                  </td>
                  <td className="p-4 text-slate-600">{prog.venue}</td>
                  <td className="p-4 font-semibold text-slate-800">{prog.capacity || '—'} pax</td>
                  <td className="p-4 font-black text-sky-950">{formatCurrency(prog.fee)}</td>
                  <td className="p-4">
                    <Badge variant="success">{prog.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
