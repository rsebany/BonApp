<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Contracts\Support\Responsable;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class NotFoundResponse implements Responsable
{
    protected string $message;
    protected string $resource;

    public function __construct(string $resource = 'Resource', string $message = null)
    {
        $this->resource = $resource;
        $this->message = $message ?? "{$resource} not found";
    }

    public function toResponse($request): JsonResponse|Response
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return new JsonResponse([
                'message' => $this->message,
                'error' => 'not_found',
                'resource' => strtolower($this->resource),
            ], 404);
        }

        return Inertia::render('Errors/404', [
            'message' => $this->message,
            'resource' => $this->resource,
        ])->toResponse($request)->setStatusCode(404);
    }

    public static function for(string $resource, string $message = null): self
    {
        return new self($resource, $message);
    }
}