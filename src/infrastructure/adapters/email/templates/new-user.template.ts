export const newUserEmailContent = (firstName: string, lastName: string, token: string) => `
  <h2>Bienvenue sur WheelZ, ${firstName} !</h2>
  <p>Cher(e) ${firstName} ${lastName},</p>
  <p>Nous sommes ravis de vous accueillir sur WheelZ, votre nouvelle plateforme de confiance pour l'historique sécurisé des véhicules.</p>
  <p>Avec WheelZ, vous êtes sur le point de découvrir une nouvelle façon de vérifier l'historique des véhicules, basée sur la technologie blockchain pour une sécurité et une transparence maximales.</p>
  
  <div class="features">
    <h3>Ce qui vous attend sur WheelZ :</h3>
    <ul>
      <li>Rapports détaillés sur l'historique des véhicules</li>
      <li>Informations vérifiées et sécurisées par blockchain</li>
      <li>Recherche facile par numéro VIN</li>
      <li>Mise à jour en temps réel des données</li>
    </ul>
  </div>

  <p>Pour commencer à explorer ces fonctionnalités et accéder à votre compte, veuillez confirmer votre adresse email :</p>
  <p style="text-align: center;">
    <a href="https://wheelz-front.zcorp.ovh/verify?token=${token}" class="button">Activer mon compte</a>
  </p>
  <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
  <p class="link">https://wheelz-front.zcorp.ovh/verify?token=${token}</p>
  <p>Une fois votre compte activé, vous pourrez immédiatement commencer à utiliser nos services pour obtenir des informations précieuses sur n'importe quel véhicule.</p>
  <p>Si vous n'avez pas créé de compte chez WheelZ, veuillez ignorer cet email.</p>
  <p>Nous sommes impatients de vous aider à prendre des décisions éclairées concernant les véhicules grâce à notre technologie de pointe.</p>
  <p>Cordialement,<br>L'équipe WheelZ</p>
`;
