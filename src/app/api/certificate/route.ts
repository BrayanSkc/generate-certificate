import { NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteerCore from 'puppeteer-core';
import { createCertificateHTML } from '@/utils/certificateTemplate';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ message: 'Missing required data' }, { status: 400 });
    }

    const html = createCertificateHTML(name);

    const isVercel = !!process.env.VERCEL && process.env.NODE_ENV === 'production';
    const isDev = process.env.NODE_ENV === 'development' && !isVercel;

    let browser: Awaited<ReturnType<typeof puppeteerCore.launch>>;
    if (isDev) {
      // Use full puppeteer locally
      const puppeteer = await import('puppeteer');
      //@ts-ignore
      browser = await puppeteer.launch({ headless: 'new' });
    } else {
      // Vercel / serverless
      browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: { width: 1123, height: 794, deviceScaleFactor: 2 },
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    }

    try {
      const page = await browser.newPage();

      await page.setViewport({ width: 1123, height: 794, deviceScaleFactor: 2 });
      await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        landscape: true,
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        preferCSSPageSize: true,
      });

      return new Response(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="certificate-${name
            .replace(/\s+/g, '-')
            .toLowerCase()}.pdf"`,
        },
      });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
