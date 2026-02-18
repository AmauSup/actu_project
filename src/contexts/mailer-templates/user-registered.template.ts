
export const getUserRegisteredTemplate = (data: {
  userName: string;
  userEmail: string;
  registrationDate: Date;
  activationLink?: string;
}) => {
  const formattedDate = data.registrationDate.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    subject: `Bienvenue ${data.userName}! Inscription confirmée`,
    html: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .welcome { font-size: 18px; font-weight: 600; color: #667eea; margin-bottom: 15px; }
        .info-box { background-color: #f0f4ff; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 4px; }
        .info-box strong { color: #667eea; }
        .button { display: inline-block; background-color: #667eea; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; margin: 20px 0; }
        .button:hover { background-color: #764ba2; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Bienvenue!</h1>
            <p>Votre compte a été créé avec succès</p>
        </div>
        <div class="content">
            <p class="welcome">Bonjour ${data.userName},</p>
            <p>Nous sommes ravis de vous accueillir dans notre communauté! Votre inscription a été confirmée.</p>
            
            <div class="info-box">
                <p><strong>Email:</strong> ${data.userEmail}</p>
                <p><strong>Date d'inscription:</strong> ${formattedDate}</p>
            </div>

            ${data.activationLink ? `
            <p>Cliquez sur le bouton ci-dessous pour activer votre compte:</p>
            <a href="${data.activationLink}" class="button">Activer mon compte</a>
            ` : ''}

            <p>Vous pouvez maintenant explorer toutes les fonctionnalités de notre plateforme.</p>

            <div class="footer">
                <p>© 2026 Actu Project. Tous droits réservés.</p>
                <p>Cet email a été envoyé à ${data.userEmail}</p>
            </div>
        </div>
    </div>
</body>
</html>
    `,
    text: `
Bienvenue ${data.userName}!

Votre inscription a été confirmée.

Email: ${data.userEmail}
Date d'inscription: ${formattedDate}

${data.activationLink ? `Lien d'activation: ${data.activationLink}` : ''}

Cordialement,
Actu Project
    `,
  };
};

export interface IUserRegisteredEmailData {
  userName: string;
  userEmail: string;
  registrationDate: Date;
  activationLink?: string;
}
