export const emailTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WheelZ</title>
    <style>
      body, html {
        font-family: 'Arial', sans-serif;
        line-height: 1.6;
        color: #333333;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
      .header {
        background-color: #3498db;
        color: #ffffff;
        padding: 20px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
      }
      .content {
        padding: 30px;
      }
      h2 {
        color: #2c3e50;
        margin-top: 0;
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #2ecc71;
        color: #ffffff;
        border-radius: 5px;
        font-weight: bold;
        margin: 20px 0;
        transition: background-color 0.3s ease;
      }
      .button:hover {
        background-color: #27ae60;
      }
      .footer {
        background-color: #34495e;
        color: #ecf0f1;
        text-align: center;
        padding: 15px;
        font-size: 0.9em;
      }
      .link {
        color: #3498db;
        word-break: break-all;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>WheelZ</h1>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p>&copy; 2024 WheelZ. Tous droits réservés.</p>
      </div>
    </div>
  </body>
</html>
`;
