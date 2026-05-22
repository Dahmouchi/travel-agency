export function reservationReceivedMessage(data: {
  prenom: string;
  nom: string;
  tourName: string;
  startDate: Date;
  endDate: Date;
  finalPrice: number;
  reservationId: string;
}) {
  return `
✅ *Réservation reçue!*

Bonjour *${data.prenom} ${data.nom}*,

Votre réservation a été reçue avec succès.

🗺️ *Tour:* ${data.tourName}
📅 *Départ:* ${data.startDate.toLocaleDateString("fr-MA")}
📅 *Retour:* ${data.endDate.toLocaleDateString("fr-MA")}
💰 *Prix total:* ${data.finalPrice} MAD
🔖 *Réf:* #${data.reservationId.slice(0, 8).toUpperCase()}

Notre équipe va confirmer votre réservation sous 24h.
Pour toute question, répondez à ce message.

_Merci de nous avoir choisis!_ 🙏
  `.trim();
}

export function reservationConfirmedMessage(data: {
  prenom: string;
  tourName: string;
  startDate: Date;
  meetingPoint?: string;
  reservationId: string;
}) {
  return `
🎉 *Réservation CONFIRMÉE!*

Bonjour *${data.prenom}*,

Votre réservation est officiellement confirmée!

🗺️ *Tour:* ${data.tourName}
📅 *Date:* ${data.startDate.toLocaleDateString("fr-MA")}
📍 *Point de rendez-vous:* ${data.meetingPoint ?? "À confirmer"}
🔖 *Réf:* #${data.reservationId.slice(0, 8).toUpperCase()}

Préparez-vous pour une aventure inoubliable! 🏔️

_À bientôt!_
  `.trim();
}
