import { Minus, Plus } from "lucide-react";
import React, { useState } from "react";

const faqs = [
  {
    question: "What is a photo frame?",
    answer:
      "A photo frame is a decorative border used to display and protect photographs. We offer a wide range of sizes and styles to suit every taste and occasion.",
  },
  {
    question: "What is Spotify photo frames?",
    answer:
      "Spotify photo frames combine your favorite music with memories. They display a scannable Spotify code alongside your photo, letting you play the song when scanned.",
  },
  {
    question: "What are coloured photo frames?",
    answer:
      "Coloured photo frames come in a variety of vibrant hues beyond the classic black or brown. They add a pop of personality to your wall décor.",
  },
  {
    question: "What is a matte finish?",
    answer:
      "A matte finish is a non-glossy surface treatment that reduces glare and reflections. It gives photos a soft, elegant look and is ideal for artistic prints.",
  },
  {
    question: "Is there any specific quantity?",
    answer:
      "No minimum quantity is required for standard orders. For bulk or corporate orders (50+ units), please contact our team for special pricing.",
  },
  {
    question: "What are the various sizes you provide?",
    answer:
      "We offer sizes ranging from 4×6 inches up to 27×36 inches. Popular sizes include 4×6, 6×8, 9×12, 12×12, 12×18, 14×18, 18×24, and 27×36.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const half = Math.ceil(faqs.length / 2);
  const leftFaqs = faqs.slice(0, half);
  const rightFaqs = faqs.slice(half);

  const renderFaqItem = (faq: (typeof faqs)[0], index: number) => (
    <div
      key={index}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setOpenIndex(openIndex === index ? null : index)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-medium text-gray-800 text-sm pr-4">
          {faq.question}
        </span>
        <div className="shrink-0 w-6 h-6 flex items-center justify-center text-primary">
          {openIndex === index ? (
            <Minus className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </div>
      </button>
      {openIndex === index && (
        <div className="px-5 pb-4 animate-fade-in">
          <p className="text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
        </div>
      )}
    </div>
  );

  return (
    <section className="py-14 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Two-column FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Left Column */}
          <div className="space-y-3">
            {leftFaqs.map((faq, i) => renderFaqItem(faq, i))}
          </div>
          {/* Right Column */}
          <div className="space-y-3">
            {rightFaqs.map((faq, i) => renderFaqItem(faq, i + half))}
          </div>
        </div>
      </div>
    </section>
  );
}
