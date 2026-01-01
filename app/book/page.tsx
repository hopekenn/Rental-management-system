// app/book/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Phone, 
  MessageSquare,
  ArrowLeft,
  Home,
  Calendar,
  CheckCircle,
  DollarSign,
  Loader2
} from 'lucide-react';

type Room = {
  _id: string;
  roomNumber: string;
  title: string;
  description: string;
  price: number;
  features: string[];
  status: 'vacant' | 'occupied';
};

export default function BookPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = searchParams.get('room');
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch room details
  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/rooms/${roomId}`);
        if (res.ok) {
          const data = await res.json();
          setRoom(data);
        }
      } catch (error) {
        console.error('Error fetching room:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!room) return;

    setSubmitting(true);

    try {
      // In real app, submit to your API
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: room._id,
          roomNumber: room.roomNumber,
          ...formData,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
        
        // Auto-redirect after 3 seconds
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setErrors({ submit: 'Failed to submit booking. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060219] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-[#060219] flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-gray-900/50 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">Room Not Found</h2>
          <p className="text-gray-400 mb-6">The room you're trying to book is not available or doesn't exist.</p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Available Rooms
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#060219]">
        <div className="container mx-auto px-4 py-12">
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="text-center bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-lg border border-gray-700 rounded-2xl p-12">
              <div className="w-20 h-20 bg-green-900/30 border border-green-700/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4">
                Booking Request Submitted!
              </h2>
              
              <p className="text-gray-300 mb-6">
                Thank you for your interest in Room {room.roomNumber}. We've received your booking request 
                and will contact you at <span className="text-blue-300">{formData.email}</span> within 24-48 hours 
                to schedule a viewing.
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-800/50 rounded-xl">
                  <p className="text-gray-400 text-sm mb-1">Booking Reference</p>
                  <p className="text-white font-mono">BOOK-{Date.now().toString().slice(-8)}</p>
                </div>
                
                <div className="p-4 bg-gray-800/50 rounded-xl">
                  <p className="text-gray-400 text-sm mb-1">Room Details</p>
                  <p className="text-white font-medium">Room {room.roomNumber} - {room.title}</p>
                  <p className="text-gray-300 text-sm">KES {room.price}/month</p>
                </div>
                
                <p className="text-gray-400 text-sm">
                  You'll be redirected to the homepage in a few seconds...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060219]">
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Available Rooms
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Room Details */}
            <div>
              <div className="sticky top-6">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                      <Home className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Room {room.roomNumber}</h2>
                      <p className="text-gray-400">{room.title}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <p className="text-gray-300">{room.description}</p>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      <span className="text-2xl font-bold text-white">KES {room.price}</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-gray-300 font-medium">Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {room.features.map((feature, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1.5 bg-gray-800/50 text-gray-300 rounded-lg text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-700">
                    <div className="flex items-center gap-3 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Available for immediate move-in</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/30 rounded-xl">
                  <h4 className="text-blue-300 font-medium mb-2">Important Note</h4>
                  <p className="text-gray-300 text-sm">
                    • Booking request does not guarantee reservation
                    <br />
                    • A viewing appointment will be scheduled
                    <br />
                    • Security deposit required upon approval
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div>
              <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-lg border border-gray-700 rounded-2xl p-8">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Book Room {room.roomNumber}
                  </h1>
                  <p className="text-gray-400">
                    Fill in your details to request a booking
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={`w-full pl-10 pr-4 py-3 bg-gray-900/50 border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-2">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className={`w-full pl-10 pr-4 py-3 bg-gray-900/50 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-2">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+254 712 345 678"
                        className={`w-full pl-10 pr-4 py-3 bg-gray-900/50 border ${errors.phone ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-400 text-sm mt-2">{errors.phone}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Tell us about yourself, your preferences, or any special requirements...
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="I'm looking for a quiet room for my studies. I work from home and need good internet..."
                        rows={4}
                        className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit Error */}
                  {errors.submit && (
                    <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg">
                      <p className="text-red-200 text-sm">{errors.submit}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-4 px-6 rounded-xl text-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                      submitting
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-xl hover:shadow-blue-500/25'
                    }`}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting Request...
                      </>
                    ) : (
                      'Request Booking'
                    )}
                  </button>

                  <div className="text-center">
                    <p className="text-gray-400 text-sm">
                      By submitting, you agree to be contacted about this room.
                    </p>
                  </div>
                </form>

                {/* Contact Info */}
                <div className="mt-8 pt-8 border-t border-gray-700">
                  <p className="text-gray-400 text-sm text-center">
                    Questions? Contact us at{' '}
                    <a href="tel:+254712345678" className="text-blue-400 hover:text-blue-300">
                      +254 712 345 678
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}