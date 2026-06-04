// lib/n8n.ts
export async function triggerN8nWorkflow(reservation: any) {
    // e.g., http://localhost:5678/webhook-test/new-reservation
    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

    try {
        const response = await fetch(`${N8N_WEBHOOK_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: reservation.id,
                phone: reservation.phone, // Ensure this strips the '+' and has the country code
                prenom: reservation.prenom,
                nom: reservation.nom,
                tourName: reservation.tour.title,
                finalPrice: reservation.finalPrice,
                startDate: reservation.startDate,
                endDate: reservation.endDate
            })
        });

        return response.ok;
    } catch (error) {
        console.error('n8n trigger failed:', error);
        return false;
    }
}