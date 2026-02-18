
export const getArticleUpdatedTemplate = (data: {
  recipientName: string;
  recipientEmail: string;
  articleTitle: string;
  updateSummary: string;
  articleUrl: string;
  updatedAt: Date;
  authorName?: string;
}) => {
  const formattedDate = data.updatedAt.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    subject: `Mise à jour: ${data.articleTitle}`,
    html: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
        .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .article-title { font-size: 20px; font-weight: 700; color: #4facfe; margin-bottom: 15px; }
        .update-box { background-color: #f0f8ff; padding: 20px; border-left: 4px solid #4facfe; margin: 20px 0; border-radius: 4px; }
        .update-summary { font-size: 14px; color: #666; line-height: 1.8; }
        .meta { font-size: 12px; color: #999; margin: 5px 0; }
        .button { display: inline-block; background-color: #4facfe; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; margin: 20px 0; }
        .button:hover { background-color: #1e90ff; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Article Mis à Jour!</h1>
            <p>Un article que vous suivez a été modifié</p>
        </div>
        <div class="content">
            <p>Bonjour ${data.recipientName},</p>
            <p>Un article a été mis à jour et nous voulions vous le faire savoir!</p>
            
            <div class="update-box">
                <div class="article-title">${data.articleTitle}</div>
                ${data.authorName ? `<div class="meta"><strong>Par:</strong> ${data.authorName}</div>` : ''}
                <div class="meta"><strong>Mise à jour:</strong> ${formattedDate}</div>
                
                <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
                
                <div class="update-summary">
                    <strong>Résumé des changements:</strong><br>
                    ${data.updateSummary}
                </div>
            </div>

            <p>Découvrez les modifications en cliquant ci-dessous:</p>
            <a href="${data.articleUrl}" class="button">Lire la version mise à jour</a>

            <div class="footer">
                <p>© 2026 Actu Project. Tous droits réservés.</p>
                <p>Cet email a été envoyé à ${data.recipientEmail}</p>
            </div>
        </div>
    </div>
</body>
</html>
    `,
    text: `
Article Mis à Jour!

Bonjour ${data.recipientName},

Un article a été mis à jour.

Titre: ${data.articleTitle}
${data.authorName ? `Par: ${data.authorName}` : ''}
Mise à jour: ${formattedDate}

Résumé des changements:
${data.updateSummary}

Lien: ${data.articleUrl}

Cordialement,
Actu Project
    `,
  };
};

export interface IArticleUpdatedEmailData {
  recipientName: string;
  recipientEmail: string;
  articleTitle: string;
  updateSummary: string;
  articleUrl: string;
  updatedAt: Date;
  authorName?: string;
}
