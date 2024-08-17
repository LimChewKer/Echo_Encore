<?php
// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $contribution = htmlspecialchars($_POST['contribution']);

    // Format the data to save
    $data = "Name: $name\nEmail: $email\nContribution: $contribution\n\n";

    // Define the file path (e.g., contributions.txt)
    $file = "contributions.txt";

    // Append the data to the file
    file_put_contents($file, $data, FILE_APPEND);

    // Redirect back to the form or show a success message
    echo "Thank you for your contribution!";
}
?>
