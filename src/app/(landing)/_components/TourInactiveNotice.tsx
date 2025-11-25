import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TourInactiveNotice() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto my-8 border border-rose-100">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="bg-rose-50 p-3 rounded-full">
          <AlertCircle className="w-8 h-8 text-rose-600" />
        </div>

        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Ce voyage n&apos;est pas disponible actuellement
          </h3>
          <p className="text-gray-600 mb-4">
            Nous sommes désolés, cette expérience n&apos;est pas proposée pour
            le moment. Consultez nos autres destinations ou contactez-nous pour
            plus d&apos;informations.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Button
              variant="outline"
              className="border-rose-300 text-rose-600 hover:bg-rose-50"
            >
              Voir nos autres voyages
            </Button>
            <Button className="bg-[#D97D55] hover:bg-[#7DAF1F]">
              Nous contacter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
