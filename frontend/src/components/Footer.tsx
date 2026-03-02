import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Phone, Mail, Heart } from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'genmitra');

  return (
    <footer style={{ backgroundColor: '#0f1729' }} className="text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 17H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6M9 12h6M9 15h4" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">GenMitra</span>
            </div>

            <p className="text-sm text-blue-300 leading-relaxed mb-5 max-w-xs">
              India's leading personalized gifting platform. We bring your memories to life with premium quality prints.
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-gray-500 shrink-0" />
                <span>+91 951 373 4374</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                <span>care@genmitra.in</span>
              </div>
            </div>
          </div>

          {/* Our Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5">Our Company</h4>
            <ul className="space-y-3">
              {['About Us', 'Careers', 'Blog'].map((link) => (
                <li key={link}>
                  <button className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5">Support</h4>
            <ul className="space-y-3">
              {[
                { label: 'Help Center', action: () => {} },
                { label: 'Track Order', action: () => navigate({ to: '/my-orders', search: { category: undefined } }) },
                { label: 'My Account', action: () => navigate({ to: '/my-orders', search: { category: undefined } }) },
              ].map(({ label, action }) => (
                <li key={label}>
                  <button
                    onClick={action}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5">Legal</h4>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Return Policy'].map((link) => (
                <li key={link}>
                  <button className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-gray-500">
              <span>© {year} GenMitra. All Rights Reserved.</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-gray-300 transition-colors duration-200"
              >
                Built with <Heart className="w-3 h-3 text-red-400 fill-red-400 mx-1" /> using caffeine.ai
              </a>
            </div>

            {/* Payment Icons */}
            <div className="flex items-center gap-2">
              <div className="bg-white rounded px-2 py-1 flex items-center justify-center">
                <span className="text-xs font-bold text-blue-800 tracking-tight">VISA</span>
              </div>
              <div className="bg-white rounded px-1.5 py-1 flex items-center justify-center gap-0.5">
                <div className="w-4 h-4 rounded-full bg-red-500 opacity-90" />
                <div className="w-4 h-4 rounded-full bg-yellow-400 opacity-90 -ml-2" />
              </div>
              <div className="bg-white rounded px-2 py-1 flex items-center justify-center">
                <span className="text-xs font-bold text-green-700 tracking-tight">UPI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
