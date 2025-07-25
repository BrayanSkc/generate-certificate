import { NextResponse } from 'next/server';
import { createCertificateHTML } from '@/utils/certificateTemplate';
import puppeteer from 'puppeteer';

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { message: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }
    console.log("Entre al POST")
    const html = createCertificateHTML(name);
    console.log("Genere el HTML")

    // Configuración mejorada de Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security', // Ayuda con algunos elementos CSS
        '--disable-features=VizDisplayCompositor',
      ]
    });

    try {
      const page = await browser.newPage();

      console.log("Genere  LA Pagina")

      // ¡IMPORTANTE! Configurar el viewport para que coincida con el tamaño del certificado
      await page.setViewport({
        width: 1123,
        height: 794,
        deviceScaleFactor: 2, // Mayor resolución para mejor calidad
      });

      // Configurar el contenido con más tiempo de espera
      await page.setContent(html, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      // // ¡CLAVE! Esperar un poco más para que se rendericen los elementos CSS complejos
      // await page.waitForTimeout(2000);

      // Configuración mejorada del PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        landscape: true, // ¡IMPORTANTE! Tu certificado está diseñado en landscape
        printBackground: true, // ¡CRÍTICO! Sin esto no se ven los gradientes ni colores de fondo
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
        preferCSSPageSize: true, // Usa el tamaño definido en @page
        scale: 1, // Mantener escala 1:1
      });

      console.log("pdfBuffer")


      return new Response(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="certificado-${name.replace(/\s+/g, '-').toLowerCase()}.pdf"`,
        },
      });

    } finally {
      await browser.close();
    }

  } catch (error: unknown) {
    console.error('Error generando certificado:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', error: "Se produjo un error en el servicio" },
      { status: 500 }
    );
  }
}