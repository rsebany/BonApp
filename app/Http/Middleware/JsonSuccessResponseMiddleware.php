<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\JsonResponse;

class JsonSuccessResponseMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($response instanceof JsonResponse && $request->is('api/*') && $response->isSuccessful()) {
            $originalData = $response->getData(true);

            if (!isset($originalData['success'])) {
                $responseData = [
                    'success' => true,
                    'data' => $originalData
                ];
                $response->setData($responseData);
            }
        }

        return $response;
    }
}
