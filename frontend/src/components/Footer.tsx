import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Phone, Mail, MapPin, Heart } from 'lucide-react';
import { SiFacebook, SiInstagram, SiX, SiYoutube } from 'react-icons/si';

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'genmitra');

  return (
    <footer className="bg-[var(--sidebar-bg)] text-[var(--sidebar-fg)]">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/assets/generated/logo.dim_320x80.png"
                alt="GenMitra"
                className="h-8 w-auto object-contain brightness-0 invert"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <span className="text-xl font-bold text-white">GenMitra</span>
            </div>
            <p className="text-sm text-[var(--sidebar-muted)] leading-relaxed mb-6 max-w-xs">
              Your trusted partner for personalized photo gifts, frames, and custom merchandise. Quality prints delivered to your doorstep.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 text-sm text-[var(--sidebar-muted)]">
                <Phone className="w-4 h-4 text-[var(--sidebar-accent)] flex-shrink-0" />
                <span>+91 8871707079</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--sidebar-muted)]">
                <Mail className="w-4 h-4 text-[var(--sidebar-accent)] flex-shrink-0" />
                <span>care@genmitra.in</span>
              </div>
            </div>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: SiFacebook, label: 'Facebook' },
                { icon: SiInstagram, label: 'Instagram' },
                { icon: SiX, label: 'Twitter' },
                { icon: SiYoutube, label: 'YouTube' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-[var(--sidebar-border)] hover:bg-[var(--sidebar-accent)] flex items-center justify-center transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Store Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Store</h4>
            <ul className="space-y-2.5">
              {['Blog', 'FAQs', 'All Products', 'Sitemap'].map((link) => (
                <li key={link}>
                  <button className="text-sm text-[var(--sidebar-muted)] hover:text-white transition-colors duration-200">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              {['About Us', 'Careers', 'Our Team', 'Contact Us'].map((link) => (
                <li key={link}>
                  <button className="text-sm text-[var(--sidebar-muted)] hover:text-white transition-colors duration-200">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Important Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2.5">
              {[
                'Customer Support',
                'Terms & Conditions',
                'Refund Policy',
                'Privacy Policy',
                'Delivery Information',
                'Track Your Order',
                'Return Your Order',
              ].map((link) => (
                <li key={link}>
                  <button className="text-sm text-[var(--sidebar-muted)] hover:text-white transition-colors duration-200">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-[var(--sidebar-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-[var(--sidebar-muted)]">
              <span>We accept:</span>
              <div className="flex items-center gap-2">
                {['Visa', 'Mastercard', 'UPI', 'COD', 'Netbanking'].map((method) => (
                  <span
                    key={method}
                    className="px-2.5 py-1 bg-[var(--sidebar-border)] rounded text-xs font-medium text-[var(--sidebar-fg)]"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[var(--sidebar-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--sidebar-muted)]">
            <span>© {year} GenMitra. All Rights Reserved.</span>
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors duration-200"
            >
              Built with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> using caffeine.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
