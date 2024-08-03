<?php
    $salutation = $_POST['salutation'];
    $lastName = $_POST['last-name'];
    $firstName = $_POST['first-name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $country = $_POST['country'];
    $streetNo = $_POST['street-no'];
    $pobox = $_POST['pobox'];
    $zip = $_POST['zip'];
    $city = $_POST['city'];
    $additionalAddressInfo = $_POST['additional-address-info'];
    $userMessage = $_POST['additional-text'];
    $acceptPrivacy = $_POST['accept-privacy'];
    $errorMessage = [];

    if($lastName == "") {
        $errorMessage['last-name'] = "form_error_empty";
    } else if (!preg_match("/^[a-züöäßáéíóàèìòêîô '-]+$/i", $lastName) {
        $errorMessage['last-name'] = "form_error_invalid_surname";
    }

    if($email == "") {
        $errorMessage['email'] = "form_error_empty";
    } else if (!preg_match("/^[a-z\d._%+-]+@[a-z\d._%+-]+\.[a-z]{2,}$/i", $email) {
        $errorMessage['email'] = "form_error_invalid_email";
    }

    if($userMessage == "") {
        $errorMessage['user-message'] = "form_error_empty";
    } else if (!preg_match("/^.{2,500}$/i", $additionalText) {
        $errorMessage['user-message'] = "form_error_invalid_message";
    }

    if(!$acceptPrivacy) {
        $errorMessage['accept-privacy'] = "no_private_policy";
    }

    header('Content-Type: application/json');

    if(!empty($errorMessage)) {
        $response = [
            'error' => true,
            'last-name' => $errorMessage['last-name'],
            'email' => $errorMessage['email'],
            'user-message' => $errorMessage['user-message']
        ];
        echo json_encode($response);
    } else {
        $salutation = $salutation == 'm' ? 'Mr.' : 'Mrs.'

        $to = 'raphael@biock.com';
        $subject = 'Mail from '.$salutation.' ' . trim($firstName.' '.$lastName).' vía contact form from website';
        $message = '<p>'.$userMessage.'</p>';

        if(!empty($phone)) {
           $message .= 'Telephone: '.$phone.'<br />' ;
        }

        if(!empty($country)) {
           $message .= 'Country: '.$country.'<br />' ;
        }

        if(!empty($streetNo)) {
           $message .= 'Street/No: '.$streetNo.'<br />' ;
        }

        if(!empty($pobox)) {
           $message .= 'PO Box: '.$pobox.'<br />' ;
        }

        if(!empty($zip) && !empty($city)) {
           $message .= 'Zip City: '.$zip.' '.$city.'<br />' ;
        }

        if(!empty($additionalAddressInfo)) {
           $message .= $additionalAddressInfo.'<br />' ;
        }

        $headers = [
            'Content-Type' => 'text/html'
            'From' => 'Contact form from website <contact@biock.com>'
        ];
        mail($to, $subject, $message, $headers);
        $response = [
            'error' => false
        ];
        echo json_encode($response);
    }
?>