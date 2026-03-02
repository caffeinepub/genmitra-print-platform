import React from 'react';
import { Star, Truck, Shield, Headphones } from 'lucide-react';

const features = [
  {
    icon: Star,
    title: 'Google Review',
    subtitle: '4.5 star customer rating',
  },
  {
    icon: Truck,
    title: 'Nationwide Delivery',
    subtitle: 'Delivery within India and internationally',
  },
  {
    icon: Shield,
    title: 'Satisfaction Guaranteed',
    subtitle: 'Free replacement or hassle-free refund',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    subtitle: 'Have a question? Talk to us today!',
  },
];

export default function TrustFeatures() {
  return (
    <section className="py-6 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex-1 flex flex-col items-center text-center py-5 px-4"
              >
                <Icon className="w-7 h-7 text-primary mb-2" strokeWidth={1.5} />
                <h3 className="font-bold text-gray-900 text-sm mb-0.5">{feature.title}</h3>
                <p className="text-xs text-gray-500 leading-snug">{feature.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
