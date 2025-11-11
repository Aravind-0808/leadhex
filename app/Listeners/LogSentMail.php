<?php

namespace App\Listeners;

use Illuminate\Mail\Events\MessageSent;
use Webkul\Email\Repositories\EmailRepository;
use Symfony\Component\Mime\Email as SymfonyEmail;

class LogSentMail
{
    public function __construct(protected EmailRepository $emailRepository)
    {
    }

    protected function extractEmails($addresses): array
    {
        $out = [];

        if (! $addresses) {
            return $out;
        }

        // Symfony Address instances (array of Address objects)
        if (is_array($addresses)) {
            foreach ($addresses as $key => $val) {
                if (is_object($val) && method_exists($val, 'getAddress')) {
                    $out[] = $val->getAddress();
                } elseif (is_string($key)) {
                    // SwiftMailer style: ['email@example.com' => 'Name']
                    $out[] = $key;
                } elseif (is_string($val)) {
                    $out[] = $val;
                }
            }
        }

        return array_values(array_filter($out));
    }

    /**
     * Handle the event.
     */
    public function handle(MessageSent $event): void
    {
        $message = $event->message;

        $to = [];
        $from = config('mail.from.address');
        $subject = '';
        $body = '';
        $cc = [];
        $bcc = [];

        // Symfony\Component\Mime\Email
        if ($message instanceof SymfonyEmail) {
            $to = $this->extractEmails($message->getTo());
            $fromAddresses = $message->getFrom();
            $from = $fromAddresses ? ($fromAddresses[0]->getAddress() ?? $from) : $from;
            $subject = $message->getSubject() ?? '';
            $body = $message->getHtmlBody() ?? $message->getTextBody() ?? (string) $message->getBody();
            $cc = $this->extractEmails($message->getCc());
            $bcc = $this->extractEmails($message->getBcc());
        } else {
            // Fallback for other message types (Swift_Message)
            try {
                $to = $this->extractEmails($message->getTo() ?? []);
            } catch (\Throwable $e) {
            }

            try {
                $fromArr = $message->getFrom() ?? [];
                if (is_array($fromArr)) {
                    $from = array_keys($fromArr)[0] ?? $from;
                }
            } catch (\Throwable $e) {
            }

            try {
                $subject = $message->getSubject() ?? '';
            } catch (\Throwable $e) {
            }

            try {
                $body = method_exists($message, 'getBody') ? (string) $message->getBody() : '';
            } catch (\Throwable $e) {
            }

            try {
                $cc = $this->extractEmails($message->getCc() ?? []);
            } catch (\Throwable $e) {
            }

            try {
                $bcc = $this->extractEmails($message->getBcc() ?? []);
            } catch (\Throwable $e) {
            }
        }

        if (empty($to)) {
            // nothing to log
            return;
        }

        $data = [
            'reply_to' => $to,
            'subject'  => $subject,
            'reply'    => $body,
            'folders'  => ['sent'],
        ];

        if ($cc) {
            $data['cc'] = $cc;
        }

        if ($bcc) {
            $data['bcc'] = $bcc;
        }

        if ($from) {
            $data['from'] = $from;
        }

        // Create email record
        try {
            $this->emailRepository->create($data);
        } catch (\Throwable $e) {
            report($e);
        }
    }
}
