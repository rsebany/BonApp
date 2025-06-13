<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MenuItemController extends Controller
{
    public function getMenuItems(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'restaurant_id' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first()
            ], 400);
        }

        try {
            // Get menu items - simplified without resource for now
            $menuItems = MenuItem::where('restaurant_id', $request->restaurant_id)
                ->select(['id', 'item_name', 'price', 'description', 'restaurant_id'])
                ->orderBy('item_name')
                ->get();

            return response()->json([
                'data' => $menuItems->toArray()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch menu items: ' . $e->getMessage()
            ], 500);
        }
    }
}