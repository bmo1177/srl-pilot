import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TeamLogoUploadProps {
  onFileSelect: (file: File | null) => void;
  previewUrl?: string;
  className?: string;
}

export function TeamLogoUpload({ onFileSelect, previewUrl, className }: TeamLogoUploadProps) {
  const [preview, setPreview] = useState<string | null>(previewUrl || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onFileSelect(null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Label className="text-lg font-semibold">Team Logo (Optional)</Label>
      
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Team logo preview"
              className="w-24 h-24 rounded-xl object-cover border-2 border-primary/20"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={handleRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-xl glass border-2 border-dashed border-primary/20 flex items-center justify-center">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        
        <div className="flex-1">
          <input
            type="file"
            id="team-logo"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Label
            htmlFor="team-logo"
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg glass border border-primary/20 hover:border-primary/40 transition-smooth"
          >
            <Upload className="h-4 w-4" />
            {preview ? 'Change Logo' : 'Upload Logo'}
          </Label>
          <p className="text-sm text-muted-foreground mt-2">
            PNG, JPG up to 2MB
          </p>
        </div>
      </div>
    </div>
  );
}
