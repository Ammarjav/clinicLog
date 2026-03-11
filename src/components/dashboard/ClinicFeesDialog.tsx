"use client";

import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Banknote, Loader2, Save } from 'lucide-react';

interface ClinicFeesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinicId: string;
  initialFees: { new: number; followUp: number };
  onSuccess: () => void;
}

const ClinicFeesDialog = ({ open, onOpenChange, clinicId, initialFees, onSuccess }: ClinicFeesDialogProps) => {
  const [newFee, setNewFee] = useState(initialFees.new.toString());
  const [followUpFee, setFollowUpFee] = useState(initialFees.followUp.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setNewFee(initialFees.new.toString());
    setFollowUpFee(initialFees.followUp.toString());
  }, [initialFees]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('clinics')
        .update({
          new_visit_fee: parseFloat(newFee) || 0,
          followup_visit_fee: parseFloat(followUpFee) || 0
        })
        .eq('id', clinicId);

      if (error) throw error;
      toast.success("Clinic fees updated");
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl dark:bg-slate-900">
        <DialogHeader>
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-4">
            <Banknote className="w-6 h-6 text-emerald-600" />
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight">Clinic Visit Fees</DialogTitle>
          <DialogDescription className="font-medium">
            Set the standard charges for your medical services.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase text-slate-400">New Patient Visit Fee</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rs.</span>
              <Input 
                type="number"
                value={newFee}
                onChange={(e) => setNewFee(e.target.value)}
                className="rounded-xl h-12 pl-12 bg-slate-50 dark:bg-slate-800 border-none"
                placeholder="0"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase text-slate-400">Follow-up Visit Fee</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rs.</span>
              <Input 
                type="number"
                value={followUpFee}
                onChange={(e) => setFollowUpFee(e.target.value)}
                className="rounded-xl h-12 pl-12 bg-slate-50 dark:bg-slate-800 border-none"
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button type="submit" className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Pricing</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClinicFeesDialog;