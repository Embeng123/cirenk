export default {
  async fetch(request, env, ctx) {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 Tutup Sementara</title>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #282c34;
            color: #61dafb;
            font-family: Arial, sans-serif;
            text-align: center;
          }
          .container {
            max-width: 600px;
            padding: 20px;
            border: 2px solid #61dafb;
            border-radius: 10px;
          }
          h1 {
            font-size: 3em;
            margin: 0;
          }
          p {
            font-size: 1.5em;
            margin: 10px 0 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>404</h1>
          <p>Tutup Sementara</p>
        </div>
      </body>
      </html>
    `;

    return new Response(htmlContent, {
      headers: { 'Content-Type': 'text/html' },
    });
  },
};
