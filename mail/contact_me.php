<?php
// Activer l'affichage des erreurs pour le débogage
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Vérifier si la requête est de type POST
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo "Erreur : Requête invalide.";
    exit;
}

// Vérifier si tous les champs sont remplis
if (empty($_POST['name']) || empty($_POST['email']) || empty($_POST['message'])) {
    echo "Erreur : Tous les champs sont obligatoires.";
    exit;
}

// Vérifier que l'adresse email est valide
if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    echo "Erreur : Adresse email invalide.";
    exit;
}

// Sécuriser les données reçues
$name    = htmlspecialchars(strip_tags($_POST['name']));
$email   = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
$message = htmlspecialchars(strip_tags($_POST['message']));

// Définir l'adresse email de destination
$to = 'saidkhatir44@gmail.com';

// Préparer le sujet et le corps du message
$email_subject = "Formulaire de contact - $name";
$email_body  = "Vous avez reçu un nouveau message depuis le formulaire de contact.\n\n";
$email_body .= "Nom : $name\n";
$email_body .= "Email : $email\n\n";
$email_body .= "Message :\n$message\n";

// Préparer les en-têtes de l'email
$headers  = "From: noreply@yourdomain.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Envoyer l'email et afficher le résultat
if (mail($to, $email_subject, $email_body, $headers)) {
    echo "Succès : Votre message a été envoyé.";
} else {
    echo "Erreur : Échec de l'envoi de l'email. Veuillez réessayer plus tard.";
}
?>
