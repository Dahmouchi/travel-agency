"use server";

import prisma from "@/lib/prisma";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { revalidatePath } from "next/cache";

export async function confirmReservation(reservationId: string) {
  const reservation = await prisma.reservations.update({
    where: { id: reservationId },
    data: {
      status: "CONFIRMED",
      paymentStatus: "CONFIRMED",
    },
    include: { tour: true },
  });

  await sendWhatsAppMessage(
    reservation.phone,
    `
🎉 *Réservation CONFIRMÉE!*

Bonjour *${reservation.prenom}*,

Votre réservation est officiellement confirmée! ✅

🗺️ *Tour:* ${reservation.tour.title}
📅 *Départ:* ${reservation.startDate.toLocaleDateString("fr-MA")}
📅 *Retour:* ${reservation.endDate.toLocaleDateString("fr-MA")}
💰 *Prix payé:* ${reservation.finalPrice} MAD
🔖 *Réf:* #${reservation.id.slice(0, 8).toUpperCase()}

📍 *Point de rendez-vous:* À confirmer 24h avant le départ.

Préparez-vous pour une aventure inoubliable! 🏔️✨

_Merci de votre confiance!_ 🙏
  `.trim(),
  );

  revalidatePath("/admin/reservations");
  return reservation;
}

export async function rejectReservation(
  reservationId: string,
  reason?: string,
) {
  const reservation = await prisma.reservations.update({
    where: { id: reservationId },
    data: {
      status: "CANCELED",
      paymentStatus: "REJECTED",
    },
    include: { tour: true },
  });

  await sendWhatsAppMessage(
    reservation.phone,
    `
❌ *Réservation non confirmée*

Bonjour *${reservation.prenom}*,

Malheureusement, nous n'avons pas pu confirmer votre réservation.

${reason ? `📝 *Raison:* ${reason}` : ""}

Veuillez nous contacter pour plus d'informations ou pour renvoyer votre reçu.

🔖 *Réf:* #${reservation.id.slice(0, 8).toUpperCase()}
  `.trim(),
  );

  revalidatePath("/admin/reservations");
  return reservation;
}
