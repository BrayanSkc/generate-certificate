export function createCertificateHTML(name: string,) {

  return /* html */ `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Certificado de Inducción - Juan Pérez</title>
  <style>
    /* Define el tamaño del PDF explícitamente */
    @page {
      size: A4 landscape;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      background: #fff;
      font-family: 'Georgia', 'Times New Roman', serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color-adjust: exact;
    }

    .certificate {
      width: 1123px;
      height: 794px;
      position: relative;
      overflow: hidden;
      margin: 0 auto;
      background: radial-gradient(ellipse at center, #fefefe 0%, #f8f9fa 100%);
      box-shadow: inset 0 0 100px rgba(0,0,0,0.1);
    }

    /* Decoración superior mejorada con múltiples capas */
    .green-decoration-top {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 140px;
      background: linear-gradient(135deg, 
        #a8e063 0%, 
        #56ab2f 30%, 
        #2d5016 70%, 
        #1a3409 100%);
      clip-path: polygon(0 0, 100% 0, 100% 45%, 85% 70%, 60% 85%, 35% 75%, 0 60%);
      filter: drop-shadow(0 8px 16px rgba(86, 171, 47, 0.3));
    }

    /* Segunda capa decorativa superior */
    .green-decoration-top::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, 
        rgba(255,255,255,0.3) 0%, 
        transparent 50%, 
        rgba(0,0,0,0.1) 100%);
      clip-path: inherit;
    }

    .green-decoration-bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40px;
      background: linear-gradient(90deg, 
        #56ab2f 0%, 
        #8bc34a 100%);
      clip-path: polygon(0 100%, 100% 100%, 100% 40%, 85% 30%, 70% 25%, 50% 30%, 30% 40%, 10% 55%, 0 70%);
      filter: drop-shadow(0 -2px 4px rgba(86, 171, 47, 0.2));
    }

    .green-decoration-bottom::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(225deg, 
        rgba(255,255,255,0.2) 0%, 
        transparent 50%, 
        rgba(0,0,0,0.1) 100%);
      clip-path: inherit;
    }

    /* Acentos decorativos mejorados */
    .green-accent-top {
      position: absolute;
      top: 35px;
      left: 0;
      right: 0;
      height: 80px;
      background: linear-gradient(135deg, 
        #f0f4c3 0%, 
        #c5e1a5 30%, 
        #8bc34a 70%, 
        #689f38 100%);
      clip-path: polygon(0 0, 100% 0, 100% 30%, 75% 60%, 50% 75%, 25% 60%, 0 45%);
      opacity: 0.9;
      filter: drop-shadow(0 4px 8px rgba(139, 195, 74, 0.4));
    }

    .green-accent-bottom {
      position: absolute;
      bottom: 8px;
      left: 0;
      right: 0;
      height: 20px;
      background: linear-gradient(90deg, 
        #2d5016 0%, 
        #56ab2f 100%);
      clip-path: polygon(0 100%, 100% 100%, 100% 50%, 90% 40%, 75% 35%, 55% 40%, 35% 50%, 20% 65%, 0 80%);
      opacity: 0.8;
      filter: drop-shadow(0 -1px 2px rgba(45, 80, 22, 0.3));
    }

    /* Patrón decorativo sutil en el fondo */
    .certificate::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        radial-gradient(circle at 25% 25%, rgba(139, 195, 74, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(104, 159, 56, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(86, 171, 47, 0.03) 0%, transparent 70%);
      pointer-events: none;
      z-index: 1;
    }

    .certificate-content {
      position: relative;
      z-index: 10;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 40px;
    }

    .certificate-title {
      font-size: 68px;
      font-weight: 700;
      color: #2c2c2c;
      margin-bottom: 8px;
      letter-spacing: 4px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
      position: relative;
    }

    .certificate-title::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 120px;
      height: 4px;
      background: linear-gradient(90deg, transparent 0%, #56ab2f 50%, transparent 100%);
      border-radius: 2px;
    }

    .certificate-subtitle {
      font-size: 32px;
      font-weight: 400;
      color: #2c2c2c;
      margin-bottom: 50px;
      letter-spacing: 2px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    }

    .certificate-text {
      font-size: 18px;
      color: #555;
      margin-bottom: 35px;
      letter-spacing: 1px;
      font-weight: 500;
    }

    .recipient-name {
      font-size: 60px;
      font-style: italic;
      color: #2c2c2c;
      margin-bottom: 15px;
      position: relative;
      padding-bottom: 15px;
      min-width: 450px;
      text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
    }

    .recipient-name::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, 
        transparent 0%, 
        #56ab2f 20%, 
        #2d5016 50%, 
        #56ab2f 80%, 
        transparent 100%);
      border-radius: 2px;
      box-shadow: 0 2px 4px rgba(86, 171, 47, 0.3);
    }

    .course-text {
      font-size: 16px;
      color: #666;
      margin-bottom: 60px;
      letter-spacing: 0.8px;
      font-weight: 500;
    }

    .signature-section {
      position: absolute;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
    }

    .signature-line {
      width: 320px;
      height: 3px;
      margin-bottom: 12px;
      background: linear-gradient(90deg, 
        transparent 0%, 
        #2c2c2c 20%, 
        #2c2c2c 80%, 
        transparent 100%);
      border-radius: 2px;
      position: relative;
    }

    .signature-line::after {
      content: '';
      position: absolute;
      top: -1px;
      left: 10%;
      right: 10%;
      height: 1px;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(255,255,255,0.8) 50%, 
        transparent 100%);
    }

    .signature-name {
      font-size: 18px;
      font-weight: 600;
      color: #2c2c2c;
      text-align: center;
      letter-spacing: 1px;
    }

    .logo {
      position: absolute;
      bottom: 70px;
      left: 70px;
      z-index: 15;
      text-align: center;
      max-width: 150px;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
    }

    .logo-image {
      width: 200px;
      height: 150px;
      object-fit: contain;
      margin-bottom: 8px;
      border-radius: 12px;
      padding: 8px;
    }

 
    /* Asegurar que todos los elementos con gradiente se rendericen */
    .green-decoration-top,
    .green-decoration-bottom,
    .green-accent-top,
    .green-accent-bottom {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color-adjust: exact;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="green-decoration-top"></div>
    <div class="green-decoration-bottom"></div>
    <div class="green-accent-top"></div>
    <div class="green-accent-bottom"></div>

    <div class="certificate-content">
      <h1 class="certificate-title">CERTIFICADO</h1>
      <h2 class="certificate-subtitle">DE INDUCCIÓN</h2>

      <p class="certificate-text">SE LE OTORGA ESTE CERTIFICADO A:</p>

      <div class="recipient-name">${name}</div>

      <p class="course-text">POR SU PARTICIPACIÓN EN EL CURSO DE INDUCCIÓN</p>
    </div>

    <div class="signature-section">
      <div class="signature-line"></div>
      <div class="signature-name">LUZ MILA GARCÍA VILLAFAÑE</div>
    </div>

    <div class="logo">
      <img src="https://abiudea.org/wp-content/uploads/2023/07/LOGO-ABIUDEA.png" alt="Logo ABIIDEA" class="logo-image" />
    </div>

  </div>
</body>
</html>`;
}