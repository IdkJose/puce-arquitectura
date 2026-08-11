<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Inicia sesión y retorna el Token JWT.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // Intentamos autenticar con el guard 'api' (que usa JWT)
        if (! $token = Auth::guard('api')->attempt($credentials)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Credenciales incorrectas',
            ], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Obtiene el perfil del usuario autenticado (opcional pero muy útil para el frontend).
     */
    public function me()
    {
        return response()->json([
            'status' => 'success',
            'user' => Auth::guard('api')->user(),
        ]);
    }

    /**
     * Cierra sesión (invalida el token).
     */
    public function logout()
    {
        Auth::guard('api')->logout();

        return response()->json([
            'status' => 'success',
            'message' => 'Sesión cerrada correctamente',
        ]);
    }

    /**
     * Refresca el token actual por uno nuevo (extiende la sesión).
     */
    public function refresh()
    {
        $newToken = Auth::guard('api')->refresh();

        return $this->respondWithToken($newToken);
    }

    /**
     * Formatea la respuesta con la estructura del token.
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'status' => 'success',
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::guard('api')->factory()->getTTL() * 60, // Tiempo de vida en segundos
        ]);
    }
}
