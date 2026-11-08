import React from 'react';
import { Calendar, Users, DollarSign, FileText, Video, CheckCircle, Database } from 'lucide-react';

export default function DoctorDashboardPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      {/* Top Banner with Shared DB Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-card border border-border bg-surface">
        <div>
          <h2 className="text-xl font-bold text-text-main">Clinical Practice Overview</h2>
          <p className="text-xs text-text-muted">
            Doctor availability: 9:00 AM – 12:00 PM IST (Asia/Kolkata)
          </p>
        </div>
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary-soft text-primary text-xs font-medium">
          <Database className="w-3.5 h-3.5" />
          <span>Shared PostgreSQL Database Active</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-card border border-border bg-surface space-y-2">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-medium">Today&apos;s Consultations</span>
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-text-main">3</div>
          <p className="text-xs text-text-muted">Slots between 09:00 - 12:00 IST</p>
        </div>

        <div className="p-5 rounded-card border border-border bg-surface space-y-2">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-medium">Standard Consultation Fee</span>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-text-main">₹150 INR</div>
          <p className="text-xs text-text-muted">Configurable in Fee Management</p>
        </div>

        <div className="p-5 rounded-card border border-border bg-surface space-y-2">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-medium">Patient Database</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-text-main">Active</div>
          <p className="text-xs text-text-muted">Shared with patient guest booking</p>
        </div>

        <div className="p-5 rounded-card border border-border bg-surface space-y-2">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-medium">Prescription Storage</span>
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-text-main">Cloudflare R2</div>
          <p className="text-xs text-text-muted">10 GB Free private storage</p>
        </div>
      </div>

      {/* Action Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments & Video Link Launch */}
        <div id="appointments" className="p-6 rounded-card border border-border bg-surface space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-text-main">Confirmed Consultations</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">Live</span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-control border border-border bg-background flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-text-main">Patient: Rahul Sharma</p>
                <p className="text-xs text-text-muted">Time: 09:30 AM – 10:00 AM IST (Today)</p>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-control bg-primary hover:bg-primary-hover text-white text-xs font-medium flex items-center space-x-1.5 transition-colors shadow-sm"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Launch Video Call</span>
              </button>
            </div>
          </div>
        </div>

        {/* Fee Management Quick Control */}
        <div id="fees" className="p-6 rounded-card border border-border bg-surface space-y-4">
          <h3 className="font-bold text-base text-text-main">Fee Management</h3>
          <p className="text-xs text-text-muted">
            Adjust prices directly. All future patient booking holds will immediately adopt these updated rates.
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-control border border-border bg-background">
              <div>
                <p className="text-sm font-medium text-text-main">India Consultation Fee</p>
                <p className="text-xs text-text-muted">Standard rate per 30-min slot</p>
              </div>
              <span className="font-bold text-sm text-primary">₹150 INR</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-control border border-border bg-background">
              <div>
                <p className="text-sm font-medium text-text-main">International Consultation Fee</p>
                <p className="text-xs text-text-muted">Configurable when international gateway active</p>
              </div>
              <span className="font-bold text-sm text-text-muted">Pending Review</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

