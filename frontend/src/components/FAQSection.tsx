import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const faqData = [
  {
    question: 'What is a photo frame?',
    answer: 'A photo frame is a decorative border used to display and protect photographs. Our frames come in various materials including wood, metal, and acrylic, with options for single or multiple photos.',
  },
  {
    question: 'What are coloured photo frames?',
    answer: 'Coloured photo frames are frames available in a variety of vibrant colors beyond traditional wood tones. They add a pop of personality to your space and can complement your home decor.',
  },
  {
    question: 'Is there any specific quantity?',
    answer: 'No minimum quantity is required for most products. You can order as little as one print or frame. For bulk corporate orders, we offer special pricing — contact us for details.',
  },
  {
    question: 'Is there any picture limit for a collage?',
    answer: 'Our collage frames can accommodate anywhere from 2 to 20 photos depending on the size and design you choose. Each slot is clearly defined in the product preview.',
  },
  {
    question: 'What is Spotify photo frames?',
    answer: 'Spotify photo frames feature a scannable Spotify code alongside your photo, allowing anyone to scan it and instantly play your favorite song. A perfect personalized gift for music lovers.',
  },
  {
    question: 'What is a matte finish?',
    answer: 'A matte finish is a non-glossy, smooth surface that reduces glare and reflections. It gives photos a sophisticated, gallery-quality look and is ideal for portraits and artistic prints.',
  },
  {
    question: 'What are the various sizes you provide?',
    answer: 'We offer prints and frames in sizes ranging from 4×6" wallet size to 24×36" large format. Popular sizes include 5×7", 8×10", 11×14", and 16×20". Custom sizes are also available on request.',
  },
  {
    question: 'What is a canvas print?',
    answer: 'A canvas print is your photo printed on high-quality canvas material and stretched over a wooden frame. It gives your image a fine-art, gallery-worthy appearance without needing a separate frame.',
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-foreground pr-4">{question}</span>
        <div className={`shrink-0 w-7 h-7 rounded-full border-2 border-primary flex items-center justify-center transition-transform duration-200 ${open ? 'bg-primary' : ''}`}>
          {open ? (
            <X className="h-3.5 w-3.5 text-primary-foreground" />
          ) : (
            <Plus className="h-3.5 w-3.5 text-primary" />
          )}
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
          {answer}
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const leftFAQs = faqData.slice(0, 4);
  const rightFAQs = faqData.slice(4, 8);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="section-title mb-3">Frequently Asked Questions</h2>
        <p className="text-muted-foreground">Everything you need to know about our products</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          {leftFAQs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
        <div className="space-y-3">
          {rightFAQs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
