import { Instrument } from "@/components/RequestForm";

export async function GET() {
  try {
    // Get all instruments
    const response = await fetch(`${process.env.RDM_HOST}/instruments`);
    if (!response.ok) {
      throw new Error("Failed to fetch instruments");
    }

    const instruments: Instrument[] = await response.json();

    return Response.json(instruments);
  } catch (error) {
    return Response.json({ error });
  }
}
