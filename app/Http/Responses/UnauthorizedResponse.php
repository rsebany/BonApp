<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Contracts\Support\Responsable;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class UnauthorizedResponse implements Responsable
{
    protected string $message;
    protected string $action;

    public function __construct(string $action = 'perform this action', string $message = null)
    {
        $this->action = $action;
        $this->message = $message ?? "You are not authorized to {$action}";
    }

    public function toResponse($request): JsonResponse|Response
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return new JsonResponse([
                'message' => $this->message,
                'error' => 'unauthorized',
                'action' => $this->action,
            ], 403);
        }

        return Inertia::render('Errors/403', [
            'message' => $this->message,
            'action' => $this->action,
        ])->toResponse($request)->setStatusCode(403);
    }

    public static function for(string $action, string $message = null): self
    {
        return new self($action, $message);
    }
}