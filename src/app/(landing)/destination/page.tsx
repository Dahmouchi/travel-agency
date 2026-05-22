"use client";

import Link from "next/link";

export default function DestinationChoicePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <div className="bg-white py-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Découvrez nos circuits
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Découvrez des expériences de voyage exceptionnelles adaptées à vos
          envies
        </p>
      </div>

      {/* Choice Section */}
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="max-w-4xl w-full space-y-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Où souhaitez-vous aller ?
            </h2>
            <p className="text-gray-600">
              Choisissez parmi nos circuits nationaux ou internationaux
              soigneusement sélectionnés
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* National Tour Button */}
            <Link
              href="/destination/national"
              className="group relative block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="absolute inset-0 bg-[#8EBD22] opacity-90 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative h-64 bg-[url('/international.png)] bg-cover bg-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <h3 className="text-3xl font-bold text-white mb-3">
                      Les Tours nationaux
                    </h3>
                    <p className="text-white/90 group-hover:text-white transition-colors">
                      Découvrez la beauté à l&apos;intérieur de nos frontières
                    </p>
                    <button className="mt-6 px-8 py-3 bg-white text-[#8EBD22] rounded-full font-medium hover:bg-gray-100 transition-colors">
                      Explorer
                    </button>
                  </div>
                </div>
              </div>
            </Link>

            {/* International Tour Button */}
            <Link
              href="/destination/international"
              className="group relative block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="absolute inset-0 bg-[#7DA61D] opacity-90 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative h-64 bg-[url('/images/international-tours.jpg')] bg-cover bg-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <h3 className="text-3xl font-bold text-white mb-3">
                      Les Tours internationaux
                    </h3>
                    <p className="text-white/90 group-hover:text-white transition-colors">
                      Voyagez vers des destinations incroyables à travers le
                      monde
                    </p>
                    <button className="mt-6 px-8 py-3 bg-white text-[#7DA61D] rounded-full font-medium hover:bg-gray-100 transition-colors">
                      Explorer
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
