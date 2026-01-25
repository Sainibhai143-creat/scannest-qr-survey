import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, MessageCircle, Send, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import scannestLogo from "@/assets/scannest-logo.png";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save contact form submission to database
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 fade-in-up">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <img 
            src={scannestLogo} 
            alt="Scannest Logo" 
            className="mx-auto mb-6 h-16 w-auto"
          />
          <h1 className="text-4xl font-bold text-gradient mb-2">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Get in touch with our team
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gradient">
                <MessageCircle className="w-6 h-6 mr-2" />
                Send us a Message
              </CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What's this about?"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-2xl text-gradient">Get in Touch</CardTitle>
                <CardDescription>
                  Reach out to us through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-muted-foreground">ravigopiramsaini1219@gmail.com</p>
                    <p className="text-muted-foreground">theemcollage2@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Phone</h4>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                    <p className="text-muted-foreground">+1 (555) 987-6543</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Address</h4>
                    <p className="text-muted-foreground">
                      123 Survey Street<br />
                      Data City, DC 12345<br />
                      United States
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-xl text-gradient">Business Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <Badge variant="secondary">9:00 AM - 6:00 PM</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <Badge variant="secondary">10:00 AM - 4:00 PM</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <Badge variant="outline">Closed</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Support Information */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-gradient">Need Quick Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  For immediate assistance with surveys or technical issues, please include:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Your account email</li>
                  <li>• Survey ID (if applicable)</li>
                  <li>• Device and browser information</li>
                  <li>• Detailed description of the issue</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            Developed by <span className="font-semibold">Setu Developer</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;