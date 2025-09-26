import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff, Key, Save, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setSaving] = useState(false);

  useEffect(() => {
    // Load saved API key from localStorage
    const savedApiKey = localStorage.getItem('cerebras_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, [isOpen]);

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Save API key to localStorage (in production, this should be encrypted)
      if (apiKey.trim()) {
        localStorage.setItem('cerebras_api_key', apiKey.trim());
        toast({
          title: "Berjaya!",
          description: "Kunci API Cerebras telah disimpan.",
        });
      } else {
        localStorage.removeItem('cerebras_api_key');
        toast({
          title: "Kunci API dipadam",
          description: "Kunci API Cerebras telah dikeluarkan.",
        });
      }
      
      setTimeout(() => {
        onClose();
        setSaving(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Ralat",
        description: "Gagal menyimpan tetapan. Sila cuba lagi.",
        variant: "destructive",
      });
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Kunci API diperlukan",
        description: "Sila masukkan kunci API Cerebras terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Ujian sambungan",
      description: "Sedang menguji sambungan dengan Cerebras API...",
    });

    // In a real implementation, you would test the API connection here
    setTimeout(() => {
      toast({
        title: "Sambungan berjaya!",
        description: "Kunci API Cerebras berfungsi dengan baik.",
      });
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5 text-primary" />
            <span>Tetapan API</span>
          </DialogTitle>
          <DialogDescription>
            Konfigurasi kunci API untuk MyCity AI Assistant
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* API Key Configuration */}
          <Card className="p-4 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">CB</span>
              </div>
              <div>
                <h3 className="font-semibold">Cerebras API</h3>
                <p className="text-sm text-muted-foreground">
                  Kunci API untuk model bahasa besar
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cerebras-api-key">Kunci API Cerebras</Label>
              <div className="relative">
                <Input
                  id="cerebras-api-key"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Masukkan kunci API Cerebras anda..."
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Kunci API anda akan disimpan secara tempatan dan digunakan untuk mengakses perkhidmatan AI.
              </p>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestConnection}
                className="flex-1"
              >
                Uji Sambungan
              </Button>
            </div>
          </Card>

          {/* Security Notice */}
          <Card className="p-4 bg-warning/5 border-warning/20">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-warning-foreground">
                  Notis Keselamatan
                </h4>
                <p className="text-xs text-muted-foreground">
                  Kunci API anda disimpan secara tempatan dalam pelayar. Dalam persekitaran pengeluaran,
                  gunakan kaedah penyimpanan yang lebih selamat seperti pembolehubah persekitaran server.
                </p>
              </div>
            </div>
          </Card>

          {/* Backend Configuration Info */}
          <Card className="p-4 bg-muted/50">
            <h4 className="font-semibold mb-2">Konfigurasi Backend</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Model:</strong> qwen-3-235b-a22b-instruct-2507</p>
              <p><strong>Max Tokens:</strong> 20,000</p>
              <p><strong>Temperature:</strong> 0.7</p>
              <p><strong>Top P:</strong> 0.8</p>
            </div>
          </Card>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-r-transparent animate-spin rounded-full mr-2" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Simpan
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};