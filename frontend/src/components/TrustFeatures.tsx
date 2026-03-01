import React from 'react';
import { Star, Truck, ShieldCheck, HeadphonesIcon } from 'lucide-react';
import { SiGoogle } from 'react-icons/si';

const features = [
  {
    icon: SiGoogle,
    isReactIcon: true,
    title: 'Google Review',
    subtitle: '4.5 star customer rating',
    extra: (
      <div className="flex items-center gap-0.5 mt-1">
        {[1, 2, 3, 4].map((s) => (
          <Star key={s} className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" />
        ))}
        <Star className="h-3.5 w-3.5 fill-brand-gold/50 text-brand-gold" />
        <span className="text-xs text-muted-foreground ml-1">4.5/5</span>
      </div>
    ),
  },
  {
    icon: Truck,
    isReactIcon: false,
    title: 'Nationwide Delivery',
    subtitle: 'Delivery within India and internationally',
    extra: null,
  },
  {
    icon: ShieldCheck,
    isReactIcon: false,
    title: 'Satisfaction Guaranteed',
    subtitle: 'Free replacement or hassle-free refund without questions',
    extra: null,
  },
  {
    icon: HeadphonesIcon,
    isReactIcon: false,
    title: 'Support',
    subtitle: 'Have a question? Talk to us today!',
    extra: null,
  },
];

export default function TrustFeatures() {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center p-6 bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                {feature.isReactIcon ? (
                  <feature.icon className="h-7 w-7 text-primary" />
                ) : (
                  <feature.icon className="h-7 w-7 text-primary" />
                )}
              </div>
              <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.subtitle}</p>
              {feature.extra}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
