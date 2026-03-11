"use client";

import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Banknote, Loader2, Save } from 'lucide-react';

interface SetFeesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinic: any;
  onSuccess: () => void;
}

const SetFeesModal = ({ open, onOpenChange, clinic, onSuccess }: SetFeesModalProps) => {
  const [loading, setLoading] = useState(false);
  const [fees, setFees] = useState({
    new: clinic?.new_visit_fee || 0,
    followUp: clinic?.follow_up_fee || 0
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('clinics')
        .update({
          new_visit_fee: fees.new,
          follow_up_fee: fees.followUp
        })
        .eq('id', clinic.id);

      if (error) throw error;
      
      toast.success("Clinic fees updated");
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-[2rem] border-none shadow-2xl dark:bg-slate-900">
        <DialogHeader>
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-4">
            <Banknote className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight">Set Visit Fees</DialogTitle>
          <DialogDescription className="font-medium text-slate-500">
            Configure the standard charges for your clinic visits.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">New Patient Fee</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rs.</span>
              <Input 
                type="number" 
                className="h-12 rounded-xl pl-12 bg-slate-50 dark:bg-slate-800 border-none font-bold"
                value={fees.new}
                onChange={(e) => setFees({ ...fees, new: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Follow-up Fee</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rs.</span>
              <Input 
                type="number" 
                className="h-12 rounded-xl pl-12 bg-slate-50 dark:bg-slate-800 border-none font-bold"
                value={fees.followUp}
                onChange={(e) => setFees({ ...fees, followUp: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            className="w-full h-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Protocol</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SetFeesModal;