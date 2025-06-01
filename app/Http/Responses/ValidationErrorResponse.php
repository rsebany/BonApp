<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Contracts\Support\Responsable;
use Illuminate\Support\MessageBag;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ValidationErrorResponse implements Responsable
{
    protected MessageBag $errors;
    protected string $message;

    public function __construct(MessageBag $errors, string $message = 'The given data was invalid.')
    {
        $this->errors = $errors;
        $this->message = $message;
    }

    public function toResponse($request): JsonResponse|Response
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return new JsonResponse([
                'message' => $this->message,
                'errors' => $this->errors->toArray(),
                'error' => 'validation_failed',
            ], 422);
        }

        return Inertia::render('Errors/422', [
            'message' => $this->message,
            'errors' => $this->errors->toArray(),
        ])->toResponse($request)->setStatusCode(422);
    }

    public static function with(MessageBag $errors, string $message = null): self
    {
        return new self($errors, $message ?? 'The given data was invalid.');
    }
}