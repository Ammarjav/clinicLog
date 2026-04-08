"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, 
  User, 
  MapPin, 
  Upload, 
  Save, 
  Loader2, 
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  X,
  Crop as CropIcon
} from 'lucide-react';
import { toast } from 'sonner';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/utils/imageCropUtils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const ClinicProfile = () => {
  const { slug } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [clinic, setClinic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [address, setAddress] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // Crop states
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCroppingModalOpen, setIsCroppingModalOpen] = useState(false);

  useEffect(() => {
    const fetchClinic = async () => {
      const { data } = await supabase
        .from('clinics')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (data) {
        setClinic(data);
        setName(data.name || '');
        setDoctorName(data.doctor_name || '');
        setAddress(data.address || '');
        setLogoUrl(data.logo_url || '');
      }
      setLoading(false);
    };
    fetchClinic();
  }, [slug]);

  const onCropComplete = useCallback((_croppedArea: any, pixelCrop: any) => {
    setCroppedAreaPixels(pixelCrop);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageToCrop(reader.result as string);
        setIsCroppingModalOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCropAndUpload = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;

    setIsUploading(true);
    setIsCroppingModalOpen(false);

    try {
      const croppedImageBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
      if (!croppedImageBlob) throw new Error("Could not process image");

      const fileExt = 'png';
      const fileName = `${clinic.id}-${Math.random()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('clinic-logos')
        .upload(filePath, croppedImageBlob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('clinic-logos')
        .getPublicUrl(filePath);

      setLogoUrl(publicUrl);
      toast.success("Logo cropped and ready to save");
    } catch (err: any) {
      toast.error("Process failed: " + err.message);
    } finally {
      setIsUploading(false);
      setImageToCrop(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('clinics')
        .update({
          name: name,
          doctor_name: doctorName,
          address: address,
          logo_url: logoUrl
        })
        .eq('slug', slug);

      if (error) throw error;
      toast.success("Clinic profile updated successfully");
      window.location.reload(); 
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin w-10 h-10 text-indigo-600" />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Loading profile...</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-2 sm:px-0">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-xl shrink-0 h-12 w-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
          <Link to={`/clinic/${slug}/dashboard`}><ArrowLeft className="w-5 h-5 text-slate-400" /></Link>
        </Button>
        <div className="overflow-hidden">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter truncate">Clinic Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-0.5">Manage your public identity and clinical details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-2xl shadow-indigo-100/10 dark:shadow-none text-center">
            <div className="relative mx-auto w-24 h-24 mb-6 group">
              {logoUrl ? (
                <div className="relative w-full h-full">
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover rounded-[2rem] shadow-lg" />
                  <button 
                    onClick={() => setLogoUrl('')}
                    className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-full h-full bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-lg">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-white dark:border-slate-900 shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{name || 'Your Clinic'}</h3>
            <p className="text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest mt-2">
              {doctorName ? `Dr. ${doctorName}` : 'Practitioner Name'}
            </p>
            
            <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800 text-left">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">
                  {address || 'Location details not provided yet.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-2xl shadow-indigo-100/10 dark:shadow-none">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Clinic Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <Input 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="rounded-2xl h-14 pl-12 bg-slate-50 dark:bg-slate-800 border-none font-bold focus:ring-indigo-500/20 dark:text-white"
                      placeholder="e.g. HealthLink Medical Center"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Practitioner / Doctor Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <Input 
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      className="rounded-2xl h-14 pl-12 bg-slate-50 dark:bg-slate-800 border-none font-bold focus:ring-indigo-500/20 dark:text-white"
                      placeholder="e.g. Alexander Wright"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Clinic Logo</Label>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileSelect} 
                  />
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none flex items-center justify-center gap-3 font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group"
                  >
                    {isUploading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                    ) : (
                      <Upload className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                    )}
                    {logoUrl ? 'Change Logo Image' : 'Choose Logo from Device'}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Clinic Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-300" />
                    <Textarea 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="rounded-2xl min-h-[100px] pl-12 pt-4 bg-slate-50 dark:bg-slate-800 border-none font-medium focus:ring-indigo-500/20 dark:text-white"
                      placeholder="Enter the full clinical address..."
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg shadow-xl shadow-indigo-100 dark:shadow-none transition-all active:scale-[0.98]" 
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting ? <Loader2 className="animate-spin w-6 h-6" /> : <><Save className="w-5 h-5 mr-3" /> Save Profile</>}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Cropping Modal */}
      <Dialog open={isCroppingModalOpen} onOpenChange={setIsCroppingModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl">
          <DialogHeader className="p-6 bg-white dark:bg-slate-900 border-b border-slate-50 dark:border-slate-800">
            <DialogTitle className="text-xl font-black flex items-center gap-2">
              <CropIcon className="w-5 h-5 text-indigo-600" />
              Adjust Clinic Logo
            </DialogTitle>
          </DialogHeader>
          
          <div className="relative h-[400px] w-full bg-slate-100 dark:bg-slate-950">
            {imageToCrop && (
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>
          
          <div className="p-6 bg-white dark:bg-slate-900 flex flex-col gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400">Zoom Level</Label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
            
            <DialogFooter className="flex gap-3 sm:gap-0">
              <Button variant="ghost" onClick={() => setIsCroppingModalOpen(false)} className="flex-1 rounded-xl h-12 font-bold text-slate-500">Cancel</Button>
              <Button onClick={handleCropAndUpload} className="flex-1 rounded-xl h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold">Apply Crop</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClinicProfile;