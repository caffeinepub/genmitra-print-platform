import React from 'react';
import { Phone, Mail, Heart } from 'lucide-react';
import { SiInstagram, SiFacebook, SiX, SiLinkedin, SiPinterest } from 'react-icons/si';

const footerLinks = {
  stores: {
    title: 'Find Stores',
    links: ['Bangalore', 'Gurgaon', 'New Delhi', 'Chennai', 'Hyderabad', 'Pune'],
  },
  company: {
    title: 'Our Company',
    links: ['About us', 'Careers', 'Blog'],
  },
  support: {
    title: 'Support',
    links: ['Help', 'Business Solutions', 'Find Stores', 'My Account', 'Track Order'],
  },
  important: {
    title: 'Important Links',
    links: ['Privacy Policy', 'Delivery & Return Policy', 'Terms & Conditions'],
  },
};

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'printcraft-studio');

  return (
    <footer className="bg-foreground text-background mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Link columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-sm mb-4 text-background/90 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-background/60 hover:text-background transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-background/90 uppercase tracking-wider">
              Contact Us
            </h3>
            <div className="space-y-3">
              <a
                href="tel:+919513734374"
                className="flex items-center gap-2 text-sm text-background/60 hover:text-background transition-colors"
              >
                <Phone className="h-4 w-4 shrink-0" />
                +91 951 373 4374
              </a>
              <a
                href="mailto:care@printo.in"
                className="flex items-center gap-2 text-sm text-background/60 hover:text-background transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0" />
                care@printo.in
              </a>
            </div>

            {/* Social Icons */}
            <div className="mt-6">
              <h4 className="text-xs font-semibold text-background/70 uppercase tracking-wider mb-3">
                Follow Us
              </h4>
              <div className="flex gap-3">
                {[
                  { Icon: SiInstagram, label: 'Instagram' },
                  { Icon: SiFacebook, label: 'Facebook' },
                  { Icon: SiX, label: 'X' },
                  { Icon: SiLinkedin, label: 'LinkedIn' },
                  { Icon: SiPinterest, label: 'Pinterest' },
                ].map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-8 h-8 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Icons */}
        <div className="mt-10 pt-8 border-t border-background/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-background/50 uppercase tracking-wider">We Accept:</span>
              <div className="flex gap-2">
                {['VISA', 'MC', 'UPI'].map((payment) => (
                  <span
                    key={payment}
                    className="px-2 py-1 bg-background/10 rounded text-xs font-bold text-background/70 border border-background/20"
                  >
                    {payment}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs text-background/40 text-center">
              © {year} Printo Document Services Pvt Ltd. All Rights Reserved.
            </p>
          </div>

          {/* Attribution */}
          <div className="mt-4 text-center">
            <p className="text-xs text-background/30">
              Built with <Heart className="inline h-3 w-3 text-red-400" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-background/60 transition-colors underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
