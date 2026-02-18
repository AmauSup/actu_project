export const getArticleCreatedTemplate = (data: {
  authorName: string;
  authorEmail: string;
  articleTitle: string;
  articleDescription: string;
  articleUrl: string;
  categories: string[];
  createdAt: Date;
}) => {
  const formattedDate = data.createdAt.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const categoriesList = data.categories.join(', ') || 'Non catégorisé';

  return {
    subject: `Votre article "${data.articleTitle}" a été publié!`,
    html: `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .article-title { font-size: 22px; font-weight: 700; color: #f5576c; margin-bottom: 15px; }
        .article-box { background-color: #fff5f7; padding: 20px; border-left: 4px solid #f5576c; margin: 20px 0; border-radius: 4px; }
        .description { font-size: 14px; color: #666; margin: 10px 0; }
        .meta { font-size: 12px; color: #999; margin: 5px 0; }
        .categories { background-color: #f9f9f9; padding: 8px 12px; border-radius: 3px; display: inline-block; font-size: 12px; color: #f5576c; }
        .button { display: inline-block; background-color: #f5576c; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; margin: 20px 0; }
        .button:hover { background-color: #e63553; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Article Publié!</h1>
            <p>Votre contenu est maintenant en ligne</p>
        </div>
        <div class="content">
            <p>Bonjour ${data.authorName},</p>
            <p>Félicitations! Votre article vient d'être publié avec succès.</p>
            
            <div class="article-box">
                <div class="article-title">${data.articleTitle}</div>
                <p class="description"><strong>Résumé:</strong> ${data.articleDescription}</p>
                <div class="meta">
                    <strong>Catégories:</strong> <span class="categories">${categoriesList}</span>
                </div>
                <div class="meta"><strong>Publié le:</strong> ${formattedDate}</div>
            </div>

            <p>Consultez votre article en cliquant sur le bouton ci-dessous:</p>
            <a href="${data.articleUrl}" class="button">Voir l'article</a>

            <p>Merci de contribuer à notre plateforme avec du contenu de qualité!</p>

            <div class="footer">
                <p>© 2026 Actu Project. Tous droits réservés.</p>
                <p>Cet email a été envoyé à ${data.authorEmail}</p>
            </div>
        </div>
    </div>
</body>
</html>
    `,
    text: `
Article Publié!

Bonjour ${data.authorName},

Votre article a été publié avec succès.

Titre: ${data.articleTitle}
Description: ${data.articleDescription}
Catégories: ${categoriesList}
Publié le: ${formattedDate}

Lien: ${data.articleUrl}

Cordialement,
Actu Project
    `,
  };
};

export interface IArticleCreatedEmailData {
  authorName: string;
  authorEmail: string;
  articleTitle: string;
  articleDescription: string;
  articleUrl: string;
  categories: string[];
  createdAt: Date;
}
