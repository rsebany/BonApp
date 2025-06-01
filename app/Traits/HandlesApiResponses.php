<?php

namespace App\Traits;

use App\Http\Responses\NotFoundResponse;
use App\Http\Responses\UnauthorizedResponse;
use App\Http\Responses\SuccessResponse;
use App\Http\Responses\ValidationErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\MessageBag;
use Illuminate\Contracts\Support\Responsable;

trait HandlesApiResponses
{
    protected function notFound(string $resource = 'Resource', string $message = null): Responsable
    {
        return NotFoundResponse::for($resource, $message);
    }

    protected function unauthorized(string $action = 'perform this action', string $message = null): Responsable
    {
        return UnauthorizedResponse::for($action, $message);
    }

    protected function success(string $message, mixed $data = null): Responsable
    {
        return SuccessResponse::with($message, $data);
    }

    protected function successWithRedirect(string $message, string $redirectTo, mixed $data = null): Responsable
    {
        return SuccessResponse::withRedirect($message, $redirectTo, $data);
    }

    protected function validationError(MessageBag $errors, string $message = null): Responsable
    {
        return ValidationErrorResponse::with($errors, $message);
    }

    protected function apiResponse(array $data, int $status = 200): JsonResponse
    {
        return response()->json($data, $status);
    }
}