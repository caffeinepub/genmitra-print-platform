import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'What file formats do you accept for photo uploads?',
    answer: 'We accept JPEG, PNG, and HEIC formats. For best print quality, we recommend uploading high-resolution images (at least 300 DPI). Our system will automatically optimize your image for the best output.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Standard delivery takes 3-5 business days. Express delivery (1-2 days) is available for select pin codes. You can check delivery availability by entering your pin code on the product page.',
  },
  {
    question: 'Can I customize the size of my photo frame?',
    answer: 'Yes! We offer a wide range of sizes from 4×6" to 20×24". You can select your preferred size on the product page. Custom sizes are also available — contact our support team for more details.',
  },
  {
    question: 'What is your return and refund policy?',
    answer: 'We offer a 100% satisfaction guarantee. If you\'re not happy with your order, contact us within 7 days of delivery and we\'ll either reprint your order or issue a full refund — no questions asked.',
  },
  {
    question: 'How do I track my order?',
    answer: 'Once your order is shipped, you\'ll receive a tracking link via email and SMS. You can also track your order by logging into your account and visiting the "My Orders" section.',
  },
  {
    question: 'Do you offer bulk or corporate orders?',
    answer: 'Absolutely! We offer special pricing for bulk orders (50+ units) and corporate gifting. Contact our team at care@genmitra.in or call +91 8871707079 for a custom quote.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[var(--accent)] uppercase tracking-widest mb-2">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Everything you need to know about our products and services</p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-card border rounded-xl overflow-hidden transition-all duration-200 ${
                openIndex === index ? 'border-[var(--accent)]/30 shadow-card' : 'border-border hover:border-border/80'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className={`font-semibold text-sm sm:text-base pr-4 ${openIndex === index ? 'text-[var(--accent)]' : 'text-foreground'}`}>
                  {faq.question}
                </span>
                <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 ${
                  openIndex === index ? 'bg-[var(--accent)] text-accent-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {openIndex === index ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </div>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 animate-fade-in">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
