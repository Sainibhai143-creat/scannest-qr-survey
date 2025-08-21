import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, QrCode } from "lucide-react";
import { SurveyData } from "@/types/survey";

interface QRGeneratorProps {
  surveyData: SurveyData;
  onContinue: () => void;
}

export const QRGenerator = ({ surveyData, onContinue }: QRGeneratorProps) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    generateQRCode();
  }, [surveyData]);

  const generateQRCode = async () => {
    try {
      setIsGenerating(true);
      
      // Create a secure data payload
      const qrPayload = {
        id: surveyData.id,
        name: surveyData.name,
        timestamp: Date.now(),
        data: btoa(JSON.stringify(surveyData)), // Base64 encode the data
      };

      const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrPayload), {
        width: 300,
        margin: 2,
        color: {
          dark: "#0F766E", // Primary teal color
          light: "#FFFFFF",
        },
      });

      setQrDataUrl(qrDataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    if (qrDataUrl) {
      const link = document.createElement("a");
      link.download = `scannest-qr-${surveyData.name}.png`;
      link.href = qrDataUrl;
      link.click();
    }
  };

  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-glow qr-container">
            <CardHeader className="text-center">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl text-gradient">
                Survey Complete!
              </CardTitle>
              <CardDescription className="text-lg">
                Your QR code has been generated successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              {isGenerating ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                  <p className="text-muted-foreground">Generating your QR code...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="p-4 bg-white rounded-xl shadow-md">
                      <img
                        src={qrDataUrl}
                        alt="Survey QR Code"
                        className="w-64 h-64"
                      />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">
                      Hello, {surveyData.name}!
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Save this QR code to access your survey data anytime. 
                      You'll need your ID ({surveyData.id}) and password to unlock the data.
                    </p>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" size="lg" onClick={downloadQR}>
                      <Download className="w-4 h-4 mr-2" />
                      Download QR
                    </Button>
                    <Button variant="gradient" size="lg" onClick={onContinue}>
                      Continue to Scanner
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};