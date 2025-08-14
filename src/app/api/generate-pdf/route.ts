import { NextResponse } from "next/server";
import { client } from "@/lib/amplify/data/client"; // tu cliente generado por amplify

export async function POST(request: Request) {
  try {
    const { html } = await request.json();
    if (!html) {
      return NextResponse.json({ error: "Missing html" }, { status: 400 });
    }

    // Llamada directa a la función Lambda registrada en el schema de Amplify
    const { data, errors } = await client.queries.generatePdf({ html });

    if (errors?.length) {
      return NextResponse.json({ error: errors[0].message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "No PDF returned" }, { status: 500 });
    }

    // data aquí es el string base64 que retorna la Lambda
    const buffer = Buffer.from(data, "base64");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=generated.pdf"
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
