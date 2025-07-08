'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CreditCard,
  Smartphone,
  Building,
  CheckCircle,
  ArrowLeft,
  BookOpen,
  Receipt,
  Download,
  Bell,
  Calendar,
  Banknote,
  Shield,
  Clock,
  AlertCircle,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  fees: number;
  processingTime: string;
}

export default function StudentPaymentPage() {
  const [step, setStep] = useState<'method' | 'details' | 'processing' | 'success'>('method');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [amount, setAmount] = useState(0);
  const [isAdmission, setIsAdmission] = useState(false);
  const [loading, setLoading] = useState(false);
  const [receiptId, setReceiptId] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: Smartphone,
      description: 'Google Pay, PhonePe, Paytm, BHIM',
      fees: 0,
      processingTime: 'Instant',
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay',
      fees: 15,
      processingTime: 'Instant',
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Building,
      description: 'All major banks supported',
      fees: 10,
      processingTime: '2-5 minutes',
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Banknote,
      description: 'Paytm, MobiKwik, Amazon Pay',
      fees: 5,
      processingTime: 'Instant',
    },
  ];

  useEffect(() => {
    // Get payment details from URL params
    const admissionParam = searchParams.get('admission');
    const amountParam = searchParams.get('amount');

    if (admissionParam === 'true') {
      setIsAdmission(true);
    }

    if (amountParam) {
      setAmount(parseInt(amountParam));
    } else {
      setAmount(2500); // Default monthly fee
    }
  }, [searchParams]);

  const selectedMethodData = paymentMethods.find((m) => m.id === selectedMethod);
  const totalAmount = amount + (selectedMethodData?.fees || 0);

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  const handleProceedPayment = () => {
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }
    setStep('details');
  };

  const handlePaymentSubmit = () => {
    setLoading(true);
    setStep('processing');

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setReceiptId('RCP' + Date.now());
      setStep('success');
      toast.success('Payment completed successfully!');
    }, 3000);
  };

  const handleDownloadReceipt = () => {
    toast.success('Receipt downloaded successfully');
  };

  const renderMethodDetails = () => {
    if (!selectedMethodData) return null;

    switch (selectedMethod) {
      case 'upi':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="upiId">UPI ID</Label>
              <Input id="upiId" placeholder="yourname@paytm" className="font-mono" />
            </div>
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                <Shield className="mr-1 inline h-4 w-4" />
                Secured by 256-bit SSL encryption
              </p>
            </div>
          </div>
        );

      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="font-mono" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" className="font-mono" />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" type="password" placeholder="123" className="font-mono" />
              </div>
            </div>
            <div>
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input id="cardName" placeholder="Name as on card" />
            </div>
          </div>
        );

      case 'netbanking':
        return (
          <div className="space-y-4">
            <div>
              <Label>Select Your Bank</Label>
              <RadioGroup defaultValue="">
                {['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'PNB', 'Other'].map((bank) => (
                  <div key={bank} className="flex items-center space-x-2">
                    <RadioGroupItem value={bank.toLowerCase()} id={bank} />
                    <Label htmlFor={bank}>{bank}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      default:
        return (
          <div className="py-8 text-center">
            <p className="text-gray-600">Payment details will be processed securely</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              {isAdmission ? 'Admission Payment' : 'Fee Payment'}
            </h1>
          </div>
          <Badge variant="outline" className="border-green-600 text-green-600">
            Secure Payment
          </Badge>
        </div>
      </header>

      <div className="mx-auto max-w-4xl p-4">
        {step === 'method' && (
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {isAdmission ? 'Admission Fee' : 'Monthly Library Fee'}
                    </span>
                    <span className="font-medium">₹{amount}</span>
                  </div>
                  {selectedMethodData && selectedMethodData.fees > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment Gateway Fee</span>
                      <span>₹{selectedMethodData.fees}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span className="text-lg">₹{totalAmount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Select Payment Method</CardTitle>
                <CardDescription>Choose your preferred payment option</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedMethod} onValueChange={handleMethodSelect}>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="relative">
                        <RadioGroupItem value={method.id} id={method.id} className="peer sr-only" />
                        <Label
                          htmlFor={method.id}
                          className="flex cursor-pointer items-center rounded-lg border-2 p-4 peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:bg-gray-50"
                        >
                          <div className="flex flex-1 items-center gap-4">
                            <div className="rounded-lg bg-gray-100 p-2">
                              <method.icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{method.name}</h3>
                              <p className="text-sm text-gray-600">{method.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                {method.fees > 0 ? (
                                  <span className="text-sm text-gray-600">+₹{method.fees}</span>
                                ) : (
                                  <Badge variant="secondary" className="text-green-600">
                                    Free
                                  </Badge>
                                )}
                              </div>
                              <p className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                {method.processingTime}
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Auto Reminders Info */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Bell className="h-5 w-5" />
                  Auto Payment Reminders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-blue-800">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">SMS reminders 3 days before due date</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span className="text-sm">
                      WhatsApp notifications for payment confirmations
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Email reminders with payment links</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleProceedPayment}
              className="w-full"
              size="lg"
              disabled={!selectedMethod}
            >
              Proceed to Pay ₹{totalAmount}
            </Button>
          </div>
        )}

        {step === 'details' && selectedMethodData && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <selectedMethodData.icon className="h-5 w-5" />
                  {selectedMethodData.name}
                </CardTitle>
                <CardDescription>Enter your payment details securely</CardDescription>
              </CardHeader>
              <CardContent>{renderMethodDetails()}</CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Amount</span>
                    <span>₹{amount}</span>
                  </div>
                  {selectedMethodData.fees > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Gateway Fee</span>
                      <span>₹{selectedMethodData.fees}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep('method')} className="flex-1">
                Back
              </Button>
              <Button onClick={handlePaymentSubmit} className="flex-1" size="lg">
                Pay Now ₹{totalAmount}
              </Button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="py-12 text-center">
            <Card>
              <CardContent className="pt-12 pb-12">
                <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <h2 className="mb-2 text-xl font-semibold">Processing Payment</h2>
                <p className="mb-4 text-gray-600">Please don't close this page or go back</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>• Verifying payment details...</p>
                  <p>• Communicating with bank...</p>
                  <p>• Confirming transaction...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 text-center">
            <Card>
              <CardContent className="pt-12 pb-12">
                <div className="mb-6">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="mb-2 text-2xl font-bold text-green-600">Payment Successful!</h2>
                  <p className="text-gray-600">Your payment has been processed successfully</p>
                </div>

                <div className="mx-auto mb-6 max-w-md rounded-lg bg-gray-50 p-6 text-left">
                  <h3 className="mb-4 font-semibold">Payment Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Receipt ID:</span>
                      <span className="font-mono">{receiptId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span>₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method:</span>
                      <span>{selectedMethodData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button onClick={handleDownloadReceipt} variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Receipt
                  </Button>

                  <Button asChild className="w-full">
                    <Link href="/student/profile">Go to Profile</Link>
                  </Button>
                </div>

                <div className="mt-8 rounded-lg bg-blue-50 p-4">
                  <div className="flex items-start gap-3">
                    <Bell className="mt-0.5 h-5 w-5 text-blue-600" />
                    <div className="text-left">
                      <h4 className="font-medium text-blue-900">Auto Reminders Activated</h4>
                      <p className="mt-1 text-sm text-blue-700">
                        You'll receive SMS and WhatsApp reminders before your next payment due date.
                        Manage notification preferences in your profile settings.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
