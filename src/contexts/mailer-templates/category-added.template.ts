
export const getCategoryAddedTemplate = (data: {
  recipientName: string;
  recipientEmail: string;
  categoryName: string;
  categoryDescription: string;
  categorySlug: string;
  createdAt: Date;
  categoryUrl?: string;
}) => {
  const formattedDate = data.createdAt.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    subject: `Nouvelle catégorie: ${data.categoryName}`,
    html: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
        .header { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .category-title { font-size: 20px; font-weight: 700; color: #fa709a; margin-bottom: 15px; }
        .category-box { background-color: #fff5f8; padding: 20px; border-left: 4px solid #fa709a; margin: 20px 0; border-radius: 4px; }
        .badge { display: inline-block; background-color: #fa709a; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-right: 8px; }
        .description { font-size: 14px; color: #666; margin: 10px 0; }
        .meta { font-size: 12px; color: #999; margin: 5px 0; }
        .button { display: inline-block; background-color: #fa709a; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; margin: 20px 0; }
        .button:hover { background-color: #f75c8e; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Nouvelle Catégorie!</h1>
            <p>Une nouvelle section s'ajoute à notre plateforme</p>
        </div>
        <div class="content">
            <p>Bonjour ${data.recipientName},</p>
            <p>Nous sommes heureux de vous annoncer l'ajout d'une nouvelle catégorie sur notre plateforme!</p>
            
            <div class="category-box">
                <span class="badge">${data.categoryName}</span>
                <div class="category-title">${data.categoryName}</div>
                <p class="description"><strong>Description:</strong> ${data.categoryDescription || 'Catégorie générale'}</p>
                <div class="meta"><strong>Identifiant:</strong> ${data.categorySlug}</div>
                <div class="meta"><strong>Ajoutée le:</strong> ${formattedDate}</div>
            </div>

            <p>Cette nouvelle catégorie vous permettra de découvrir du contenu spécialisé et organisé.</p>

            ${data.categoryUrl ? `
            <p>Explorez la nouvelle catégorie en cliquant ci-dessous:</p>
            <a href="${data.categoryUrl}" class="button">Découvrir</a>
            ` : ''}

            <p>Restez à l'écoute pour plus de nouvelles sections qui enrichiront notre plateforme!</p>

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
Nouvelle Catégorie!

Bonjour ${data.recipientName},

Une nouvelle catégorie a été ajoutée à notre plateforme.

Nom: ${data.categoryName}
Description: ${data.categoryDescription || 'Catégorie générale'}
Identifiant: ${data.categorySlug}
Ajoutée le: ${formattedDate}

${data.categoryUrl ? `Lien: ${data.categoryUrl}` : ''}

Cordialement,
Actu Project
    `,
  };
};

export interface ICategoryAddedEmailData {
  recipientName: string;
  recipientEmail: string;
  categoryName: string;
  categoryDescription?: string;
  categorySlug: string;
  createdAt: Date;
  categoryUrl?: string;
}
