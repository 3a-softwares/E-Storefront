'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt, faClock, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '@/lib/hooks/useToast';
import { Button, Input } from '3a-ecommerce-ui-library';

export default function ContactPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white/95 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center w-full">
            <img
              src={
                'https://res.cloudinary.com/dpdfyou3r/image/upload/v1767265363/logo/3A_gczh29.png'
              }
              alt={'3A Softwares'}
              className="object-contain w-28"
            />
            <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-300 mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as
              soon as possible.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    label="Your Name *"
                    placeholder="John Doe"
                    className=""
                  />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    label="Email Address *"
                    placeholder="john@example.com"
                    className=""
                  />
                </div>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  label="Subject *"
                  placeholder="How can we help you?"
                  className=""
                />
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                <Button type="submit" disabled={loading} variant="primary" size="lg" className="">
                  <FontAwesomeIcon icon={faPaperPlane} className="w-5 h-5" />
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-gray-200 to-gray-200 rounded-lg">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                    <p className="text-gray-600 text-sm">
                      167, Dayanand Ward
                      <br />
                      Sagar, Madhya Pradesh 470002
                      <br />
                      India
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-gray-200 to-gray-200 rounded-lg">
                    <FontAwesomeIcon icon={faPhone} className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                    <p className="text-gray-600 text-sm">+91 70470 26537</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-gray-200 to-gray-200 rounded-lg">
                    <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600 text-sm">support@shophub.com</p>
                    <p className="text-gray-600 text-sm">sales@shophub.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-gray-200 to-gray-200 rounded-lg">
                    <FontAwesomeIcon icon={faClock} className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Business Hours</h4>
                    <p className="text-gray-600 text-sm">Monday - Friday: 9AM - 6PM</p>
                    <p className="text-gray-600 text-sm">Saturday: 10AM - 4PM</p>
                    <p className="text-gray-600 text-sm">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-black to-gray-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Quick Response</h3>
              <p className="text-blue-100 text-sm mb-4">
                We typically respond to all inquiries within 24 hours during business days.
              </p>
              <div className="bg-white/20 rounded-lg p-3 text-sm">
                <p className="font-semibold mb-1">For urgent matters:</p>
                <p className="text-blue-100">Call us at +91 70470 26537</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
