'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clock,
  Calendar,
  CreditCard,
  FileText,
  CheckCircle,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ShiftOption {
  id: string;
  name: string;
  time: string;
  description: string;
  availableSeats: number;
  totalSeats: number;
  price: {
    monthly: number;
    quarterly: number;
    halfYearly: number;
    yearly: number;
  };
}

interface FormData {
  name: string;
  fatherName: string;
  address: string;
  aadhaar: string;
  shift: string;
  duration: string;
  startDate: string;
}

export default function StudentAdmissionPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    fatherName: '',
    address: '',
    aadhaar: '',
    shift: '',
    duration: '',
    startDate: '',
  });
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const shifts: ShiftOption[] = [
    {
      id: 'morning',
      name: 'Morning Shift',
      time: '6:00 AM - 2:00 PM',
      description: 'Perfect for early risers and students',
      availableSeats: 25,
      totalSeats: 50,
      price: { monthly: 2500, quarterly: 7000, halfYearly: 13000, yearly: 24000 },
    },
    {
      id: 'day',
      name: 'Day Shift',
      time: '8:00 AM - 6:00 PM',
      description: 'Full day access for serious study',
      availableSeats: 15,
      totalSeats: 40,
      price: { monthly: 3000, quarterly: 8500, halfYearly: 16000, yearly: 30000 },
    },
    {
      id: 'evening',
      name: 'Evening Shift',
      time: '2:00 PM - 10:00 PM',
      description: 'Ideal for working professionals',
      availableSeats: 30,
      totalSeats: 45,
      price: { monthly: 2800, quarterly: 8000, halfYearly: 15000, yearly: 28000 },
    },
    {
      id: 'night',
      name: 'Night Shift',
      time: '6:00 PM - 2:00 AM',
      description: 'For night owls and competitive exam prep',
      availableSeats: 20,
      totalSeats: 35,
      price: { monthly: 2200, quarterly: 6300, halfYearly: 12000, yearly: 22000 },
    },
    {
      id: 'double',
      name: 'Double Shift',
      time: '6:00 AM - 6:00 PM',
      description: 'Morning + Day combined access',
      availableSeats: 10,
      totalSeats: 25,
      price: { monthly: 4500, quarterly: 12500, halfYearly: 24000, yearly: 45000 },
    },
    {
      id: 'triple',
      name: 'Triple Shift',
      time: '6:00 AM - 10:00 PM',
      description: 'Maximum study hours coverage',
      availableSeats: 5,
      totalSeats: 15,
      price: { monthly: 6000, quarterly: 17000, halfYearly: 32000, yearly: 60000 },
    },
    {
      id: '24hour',
      name: '24-Hour Access',
      time: 'Round the clock',
      description: 'Complete flexibility, study anytime',
      availableSeats: 3,
      totalSeats: 10,
      price: { monthly: 8000, quarterly: 22000, halfYearly: 42000, yearly: 80000 },
    },
  ];

  // Form data shift selected

  const durationOptions = [
    { value: 'monthly', label: 'Monthly', discount: 0 },
    { value: 'quarterly', label: 'Quarterly (3 Months)', discount: 5 },
    { value: 'halfYearly', label: 'Half-Yearly (6 Months)', discount: 12 },
    { value: 'yearly', label: 'Yearly (12 Months)', discount: 20 },
  ];

  useEffect(() => {
    // Check authentication and get phone number
    const authData = localStorage.getItem('studentAuth');
    if (authData) {
      setPhone(JSON.parse(authData).phone);
    }
  }, []);

  const selectedShift = shifts.find((s) => s.id === formData.shift);
  const selectedDuration = durationOptions.find((d) => d.value === formData.duration);
  const totalAmount =
    selectedShift && selectedDuration
      ? selectedShift.price[formData.duration as keyof typeof selectedShift.price]
      : 0;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.fatherName || !formData.address || !formData.aadhaar) {
        toast.error('Please fill all personal details');
        return;
      }
      if (formData.aadhaar.length !== 12) {
        toast.error('Please enter valid 12-digit Aadhaar number');
        return;
      }
    }

    if (step === 2) {
      if (!formData.shift || !formData.duration || !formData.startDate) {
        toast.error('Please select shift, duration, and start date');
        return;
      }
    }

    setStep(step + 1);
  };

  const handleSubmitAdmission = async () => {
    setLoading(true);

    // Simulate admission processing
    setTimeout(() => {
      setLoading(false);
      toast.success('Form submitted successfully!');
      router.push('/student/payment?admission=true&amount=' + totalAmount);
    }, 2000);
  };

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
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
            <h1 className="text-xl font-bold text-gray-900">New Admission</h1>
          </div>
          <div className="text-sm text-gray-600">Step {step} of 3</div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl p-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between">
            <span
              className={`text-sm ${step >= 1 ? 'font-medium text-blue-600' : 'text-gray-400'}`}
            >
              Personal Details
            </span>
            <span
              className={`text-sm ${step >= 2 ? 'font-medium text-blue-600' : 'text-gray-400'}`}
            >
              Shift & Duration
            </span>
            <span
              className={`text-sm ${step >= 3 ? 'font-medium text-blue-600' : 'text-gray-400'}`}
            >
              Confirmation
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Personal Details */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Please provide your personal details for admission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="fatherName">Father&apos;s Name *</Label>
                  <Input
                    id="fatherName"
                    value={formData.fatherName}
                    onChange={(e) => handleInputChange('fatherName', e.target.value)}
                    placeholder="Enter father's name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" value={phone} disabled className="bg-gray-50" />
                </div>
                <div>
                  <Label htmlFor="aadhaar">Aadhaar Number *</Label>
                  <Input
                    id="aadhaar"
                    value={formData.aadhaar}
                    onChange={(e) =>
                      handleInputChange('aadhaar', e.target.value.replace(/\D/g, '').slice(0, 12))
                    }
                    placeholder="Enter 12-digit Aadhaar number"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your complete address"
                />
              </div>
              <Button onClick={handleNextStep} className="w-full">
                Next: Select Shift & Duration
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Shift & Duration Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Select Your Shift
                </CardTitle>
                <CardDescription>Choose the time slot that best fits your schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.shift}
                  onValueChange={(value) => handleInputChange('shift', value)}
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {shifts.map((shift) => (
                      <div key={shift.id} className="relative">
                        <RadioGroupItem value={shift.id} id={shift.id} className="peer sr-only" />
                        <Label
                          htmlFor={shift.id}
                          className="flex cursor-pointer flex-col rounded-lg border-2 border-gray-200 p-4 transition-all duration-200 peer-checked:border-4 peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:border-gray-300 hover:bg-gray-50"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <h3 className="font-semibold">{shift.name}</h3>
                            <Badge
                              variant="outline"
                              className={getAvailabilityColor(
                                shift.availableSeats,
                                shift.totalSeats
                              )}
                            >
                              {shift.availableSeats}/{shift.totalSeats}
                            </Badge>
                          </div>
                          <p className="mb-2 text-sm text-gray-600">{shift.time}</p>
                          <p className="mb-3 text-xs text-gray-500">{shift.description}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>Monthly: ₹{shift.price.monthly}</div>
                            <div>Quarterly: ₹{shift.price.quarterly}</div>
                            <div>Half-Yearly: ₹{shift.price.halfYearly}</div>
                            <div>Yearly: ₹{shift.price.yearly}</div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Duration & Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="duration">Select Duration</Label>
                    <Select
                      value={formData.duration}
                      onValueChange={(value) => handleInputChange('duration', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {durationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex w-full items-center justify-between">
                              <span>{option.label}</span>
                              {option.discount > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                  {option.discount}% OFF
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.shift && formData.duration && (
                    <div className="rounded-lg bg-blue-50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Total Amount:</span>
                        <span className="text-xl font-bold text-blue-600">₹{totalAmount}</span>
                      </div>
                      {selectedDuration && selectedDuration.discount > 0 && (
                        <p className="mt-1 text-sm text-green-600">
                          You save {selectedDuration.discount}% with this plan!
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Start Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="startDate">Preferred Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="mt-4 rounded-lg bg-yellow-50 p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Your admission will be confirmed after payment
                      completion. Locker will be assigned based on availability.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleNextStep} className="flex-1">
                Review & Confirm
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Confirm Your Admission
              </CardTitle>
              <CardDescription>
                Please review your details before proceeding to payment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Personal Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span>{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Father&apos;s Name:</span>
                      <span>{formData.fatherName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span>+91 {phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Aadhaar:</span>
                      <span>****-****-{formData.aadhaar.slice(-4)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Enrollment Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shift:</span>
                      <span>{selectedShift?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timing:</span>
                      <span>{selectedShift?.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span>{selectedDuration?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span>{new Date(formData.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-green-900">Total Fee</h3>
                    <p className="text-sm text-green-700">{selectedDuration?.label}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">₹{totalAmount}</p>
                    {selectedDuration && selectedDuration.discount > 0 && (
                      <p className="text-sm text-green-600">
                        ({selectedDuration.discount}% discount applied)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back to Edit
                </Button>
                <Button onClick={handleSubmitAdmission} disabled={loading} className="flex-1">
                  {loading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Proceed to Payment
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
