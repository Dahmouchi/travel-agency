/* eslint-disable @typescript-eslint/no-unused-vars */

import SafeHTML from "@/components/SafeHTML";
import prisma from "@/lib/prisma";

import { ChevronDown, FileText, HelpCircle, Scale, Shield } from "lucide-react";

export default async function CategoryToursPage() {
  // Fetch data
  const sections = await prisma.landing.findFirst({});

  return (
    <div>
      <section className="relative min-h-fit py-16 flex items-center justify-center bg-gradient-to-br from-[#5a7c15] via-[#D97D55] to-[#b5e637] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-1/4 text-white/20 animate-bounce">
          <FileText className="w-12 h-12" />
        </div>
        <div
          className="absolute bottom-20 right-1/4 text-white/20 animate-bounce"
          style={{ animationDelay: "-3s" }}
        >
          <Scale className="w-10 h-10" />
        </div>
        <div
          className="absolute top-1/3 right-10 text-white/20 animate-bounce"
          style={{ animationDelay: "-1.5s" }}
        >
          <Shield className="w-8 h-8" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="lg:mb-8 mb-4 animate-fade-in">
            <span className="inline-block px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              📜 Transparence et clarté
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-slide-up">
            Conditions Générales de Vente
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Consultez nos conditions complètes pour comprendre vos droits et nos
            engagements lors de vos réservations avec Happy Trip
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <a
              href="#conditions"
              className="inline-flex justify-center items-center px-8 py-4 bg-white text-[#D97D55] rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <FileText className="w-5 h-5 mr-2" />
              <span>Lire les conditions</span>
            </a>
            <a
              href="#contact"
              className="inline-flex justify-center items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-[#D97D55] transition-all duration-300 transform hover:scale-105"
            >
              <HelpCircle className="w-5 h-5 mr-2" />
              <span>Questions ?</span>
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      <div
        className=" w-full flex items-center justify-center pt-8"
        id="conditions"
      >
        <div className="lg:max-w-2/3 px-4">
          <SafeHTML className="text-base/8" html={sections?.condition || ""} />
        </div>
      </div>
    </div>
  );
}
