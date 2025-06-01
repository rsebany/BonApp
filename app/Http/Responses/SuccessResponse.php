<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Contracts\Support\Responsable;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class SuccessResponse implements Responsable
{
    protected string $message;
    protected mixed $data;
    protected string $redirectTo;

    public function __construct(string $message, mixed $data = null, string $redirectTo = null)
    {
        $this->message = $message;
        $this->data = $data;
        $this->redirectTo = $redirectTo;
    }

    public function toResponse($request): JsonResponse|RedirectResponse|Response
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            $response = [
                'message' => $this->message,
                'success' => true,
            ];

            if ($this->data !== null) {
                $response['data'] = $this->data;
            }

            return new JsonResponse($response, 200);
        }

        if ($this->redirectTo) {
            return redirect($this->redirectTo)->with('success', $this->message);
        }

        return back()->with('success', $this->message);
    }

    public static function with(string $message, mixed $data = null): self
    {
        return new self($message, $data);
    }

    public static function withRedirect(string $message, string $redirectTo, mixed $data = null): self
    {
        return new self($message, $data, $redirectTo);
    }
}