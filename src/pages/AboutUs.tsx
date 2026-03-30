import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-[#228b22]/20">
      <header className="z-50 pt-0 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-2xl rounded-full border border-white/30 shadow-xl px-6 py-4 mt-6">
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 text-gray-700 hover:text-[#228b22] transition-colors font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>

              <div className="flex items-center gap-3">
                <img
                  src="/brand.png"
                  alt="UrCare Logo"
                  className="h-10 md:h-12 w-auto"
                  onError={(e) => {
                    const parent = e.currentTarget.parentElement;
                    if (parent && !parent.querySelector(".logo-fallback")) {
                      const fallback = document.createElement("span");
                      fallback.className =
                        "logo-fallback text-xl md:text-2xl font-bold text-gray-900";
                      fallback.textContent = "URCARE";
                      parent.appendChild(fallback);
                    }
                    e.currentTarget.style.display = "none";
                  }}
                />
                <span className="text-lg md:text-xl font-bold text-gray-900">
                  UrCare ~ True Healthcare
                </span>
              </div>

              <div className="w-[64px]" />
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl p-6 md:p-10"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Welcome to UrCare ~ True Healthcare 💚
            </h1>

            <div className="mt-6 rounded-2xl overflow-hidden bg-gray-100">
              <img
                src="/huhu.PNG"
                alt="UrCare medical team"
                className="w-full h-auto object-contain"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/hh.JPG";
                }}
              />
            </div>

            <p className="mt-5 text-gray-700 leading-relaxed">
              You are now under the care of a specialised, multi-disciplinary
              diabetes treatment team focused on personalised, root-cause-based
              healing.
            </p>

            <h2 className="mt-8 text-xl md:text-2xl font-bold text-gray-900">
              Your care team includes:
            </h2>

            <ul className="mt-4 space-y-2 text-gray-800">
              <li>• Dr. V.K. Verma (M.B.B.S., C.C.E.B.D.M.) - Senior Diabetologist</li>
              <li>• Vaidya Narendra Saini (B.A.M.S.) - Ayurvedic Physician (26+ years of practice)</li>
              <li>• Dr. Aakarshakk (B.A.M.S., CEO) - Endocrine-Focused Practice</li>
              <li>• Dt. Sejal - Diabetic Nutritionist & CMO</li>
              <li>• Mrs. Archana Arya - Yogacharya (Therapeutic Exercise Specialist)</li>
            </ul>

            <p className="mt-8 text-gray-700 leading-relaxed">
              Dr. Aakarshakk (BAMS, CEO) personally oversees every case, with
              continuous support from our medical professionals and protocol
              team throughout your treatment journey.
            </p>

            <p className="mt-4 text-gray-700 leading-relaxed">
              We are committed to guiding you with clarity, precision, and
              consistent medical supervision, every step of the way toward healing.
              Feel free to connect and start your reversal journey now on WhatsApp{" "}
              <a
                href="https://wa.aisensy.com/aaba7s"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#228b22] font-semibold underline"
              >
                https://wa.aisensy.com/aaba7s
              </a>
              .
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AboutUs;

