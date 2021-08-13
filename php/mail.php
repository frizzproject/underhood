<?php

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    use PHPMailer\PHPMailer\SMTP;

    require 'plugins/PHPMailer/src/Exception.php';
    require 'plugins/PHPMailer/src/PHPMailer.php';
    require 'plugins/PHPMailer/src/SMTP.php';

    $mail = new PHPMailer(true);
    $mail->CharSet = 'UTF-8';
    $mail->setLanguage('ru', 'plugins/PHPMailer/language/');
    $mail->isHTML(true);

//    // НАСТРОЙКИ SMTP
//    $mail -> isSMTP();
//    $mail -> Host = 'smtp.gmail.com';
//    $mail -> SMTPAuth = 'true';
//    $mail -> SMTPSecure = 'tls';
//    $mail -> Port = '587';
//    $mail -> Username = '';
//    $mail -> Password = '';

    // ПЕРЕМЕННЫЕ (ДАННЫЕ)
    $admin_address     = 'mbf.programmer@gmail.com';                         // АДРЕС АДМИНА
    $subject           = 'Данные отправленные с формы Underhood';            // ТЕМА

    // ОТ КОГО
    $mail->setFrom($admin_address, 'Underhood');
    // КОМУ
    $mail->addAddress($admin_address);
    // ТЕМА ПИСЬМА
    $mail->Subject = $subject;
    // ТЕЛО ПИСЬМА
    $body = '<h3>Письмо:</h3>';

    if (trim(!empty($_POST['email']))) {
        $body .= '<p><strong>E-mail:</strong> '.$_POST['email'].'</p>';
    }
    if (trim(!empty($_POST['text']))) {
        $body .= '<p><strong>Text:</strong> '.$_POST['text'].'</p>';
    }

    $mail->Body = $body;

    // ОТПРАВКА
    // if ( $mail->send() ) {
    //     echo('OK!');
    // } else {
    //     echo('ERROR!');
    // }

    if ($mail->send()) {
        $message = 'Ошибка!';
    } else {
        $message = 'Ок!';
    }

    $response = ['message' => $message];

    header('Content-type: application/json');
    echo json_encode($response);

?>
