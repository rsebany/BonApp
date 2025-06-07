<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'email_verified_at' => $this->email_verified_at,
            'created_at' => $this->created_at,
        ];
    }

    /**
     * Determine if email should be included in response
     */
    private function shouldIncludeEmail(Request $request): bool
    {
        $user = $request->user();
        
        // Include email if user is viewing their own profile or if user is admin
        return $user && ($user->id === $this->id || $user->role === 'admin');
    }

    /**
     * Determine if role should be included in response
     */
    private function shouldIncludeRole(Request $request): bool
    {
        $user = $request->user();
        
        // Include role if user is viewing their own profile or if user is admin
        return $user && ($user->id === $this->id || $user->role === 'admin');
    }
}