import { Headphones, RefreshCw, Shield, Truck } from "lucide-react";

const features = [
  { icon: Truck, title: "Free Delivery", subtitle: "On orders above ₹499" },
  {
    icon: Shield,
    title: "Secure Payment",
    subtitle: "100% secure transactions",
  },
  { icon: RefreshCw, title: "Easy Returns", subtitle: "7-day return policy" },
  {
    icon: Headphones,
    title: "24/7 Support",
    subtitle: "Dedicated customer care",
  },
];

export default function TrustFeatures() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="flex items-center gap-3 py-4 px-4 md:px-6"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#2874f0]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{f.title}</p>
                  <p className="text-xs text-gray-500">{f.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
