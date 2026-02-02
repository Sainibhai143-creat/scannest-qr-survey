import React, { useState, useRef, useEffect } from "react";
import QrScanner from "qr-scanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Upload, Scan, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QRScannerProps {
  onScanSuccess: (data: any) => void;
}

interface DynamicQRPayload {
  type: 'scannest_dynamic';
  survey_id: string;
  name: string;
  timestamp: number;
}

export const QRScanner = ({ onScanSuccess }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkCameraPermission();
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
      }
    };
  }, []);

  const checkCameraPermission = async () => {
    try {
      const hasCam = await QrScanner.hasCamera();
      setHasCamera(hasCam);
    } catch (error) {
      console.error("Error checking camera:", error);
      setHasCamera(false);
    }
  };

  // Fetch survey data from database using edge function
  const fetchSurveyData = async (surveyId: string): Promise<any> => {
    console.log("Fetching survey data from database for ID:", surveyId);
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('get-survey-data', {
        body: { survey_id: surveyId }
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || "Failed to fetch survey data");
      }

      if (!data?.success) {
        throw new Error(data?.error || "Survey not found");
      }

      console.log("Survey data fetched successfully:", data.data.fullName);
      return data.data;
    } catch (err) {
      console.error("Error fetching survey data:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Process scanned QR data (dynamic or legacy)
  const processQRData = async (qrData: any) => {
    try {
      // Check if this is a dynamic QR code
      if (qrData.type === 'scannest_dynamic' && qrData.survey_id) {
        console.log("Dynamic QR detected, fetching latest data...");
        toast({
          title: "QR Code Detected",
          description: "Fetching latest survey data from database...",
        });
        
        const surveyData = await fetchSurveyData(qrData.survey_id);
        onScanSuccess({ data: btoa(JSON.stringify(surveyData)), dynamic: true });
        
        toast({
          title: "Data Loaded",
          description: `Survey data for ${surveyData.fullName} loaded successfully!`,
        });
      } else if (qrData.data) {
        // Legacy QR with encoded data
        console.log("Legacy QR code detected");
        onScanSuccess(qrData);
        toast({
          title: "QR Code Scanned",
          description: "QR code successfully processed!",
        });
      } else {
        throw new Error("Invalid QR code format");
      }
    } catch (error: any) {
      console.error("Error processing QR:", error);
      toast({
        title: "Scan Failed",
        description: error.message || "Could not process QR code",
        variant: "destructive",
      });
    }
  };

  const startScanning = async () => {
    if (!videoRef.current) return;

    try {
      setIsScanning(true);
      
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        async (result: QrScanner.ScanResult) => {
          try {
            const qrData = JSON.parse(result.data);
            stopScanning();
            await processQRData(qrData);
          } catch (error) {
            toast({
              title: "Invalid QR Code",
              description: "This QR code is not from Scannest app.",
              variant: "destructive",
            });
          }
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await qrScannerRef.current.start();
    } catch (error) {
      console.error("Error starting scanner:", error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
    }
    setIsScanning(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // scanImage returns either a string or ScanResult object depending on options
      const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true });
      const scannedData = typeof result === 'string' ? result : result.data;
      
      console.log("Scanned QR data from image:", scannedData);
      
      // Try to parse as JSON first
      let qrData;
      try {
        qrData = JSON.parse(scannedData);
      } catch {
        // If not JSON, wrap it
        qrData = { data: scannedData, raw: true };
      }
      
      // Process the QR data (handles both dynamic and legacy)
      await processQRData(qrData);
    } catch (error) {
      console.error("QR scan error:", error);
      toast({
        title: "Scan Failed",
        description: "Could not read QR code from image. Make sure the image is clear and contains a valid QR code.",
        variant: "destructive",
      });
    }
    
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-elegant">
            <CardHeader className="text-center">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Scan className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl text-gradient">
                Scan QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {hasCamera ? (
                <div className="space-y-4">
                  <div className="relative">
                    <video
                      ref={videoRef}
                      className="w-full h-64 bg-black rounded-lg object-cover"
                      style={{ display: isScanning ? "block" : "none" }}
                    />
                    {!isScanning && (
                      <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            Click start to begin scanning
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {!isScanning ? (
                      <Button
                        onClick={startScanning}
                        variant="gradient"
                        size="lg"
                        className="flex-1"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Start Camera
                      </Button>
                    ) : (
                      <Button
                        onClick={stopScanning}
                        variant="destructive"
                        size="lg"
                        className="flex-1"
                      >
                        Stop Camera
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Camera className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    Camera not available or permission denied
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or upload image
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qr-upload">Upload QR Code Image</Label>
                  <div className="flex gap-2">
                    <Input
                      id="qr-upload"
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};