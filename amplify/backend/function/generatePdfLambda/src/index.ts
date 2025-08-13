import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export const handler = async (event: any) => {
    try {
        const body = JSON.parse(event.body || "{}");
        const html = body.html;
        if (!html) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing html" }),
            };
        }

        const browser = await puppeteerCore.launch({
            args: chromium.args,
            defaultViewport: { width: 1280, height: 800 },
            executablePath: await chromium.executablePath(),
            headless: true,
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "domcontentloaded" });
        const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
        await browser.close();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/pdf" },
            body: Buffer.from(pdfBuffer).toString("base64"),
            isBase64Encoded: true,
        };
    } catch (err: any) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
};
