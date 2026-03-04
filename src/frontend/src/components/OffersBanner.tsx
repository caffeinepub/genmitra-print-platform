import { useNavigate } from "@tanstack/react-router";
import { Tag } from "lucide-react";

export default function OffersBanner() {
  const navigate = useNavigate();

  return (
    <section className="mb-8">
      <div
        className="rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{
          background: "linear-gradient(135deg, #1a237e 0%, #2874f0 100%)",
        }}
      >
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <Tag className="w-3 h-3" />
            LIMITED TIME OFFER
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Get 20% Off Your First Order!
          </h3>
          <p className="text-blue-200 text-sm">
            Use code{" "}
            <span className="font-bold text-yellow-300 text-base">
              WELCOME20
            </span>{" "}
            at checkout
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            navigate({
              to: "/",
              search: { category: undefined, search: undefined },
            })
          }
          className="px-8 py-3 bg-white text-[#2874f0] font-bold rounded hover:bg-gray-100 transition-colors text-sm flex-shrink-0"
        >
          Claim Now →
        </button>
      </div>
    </section>
  );
}
