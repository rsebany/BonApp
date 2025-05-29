<?php

namespace App\Http\Controllers;

use App\Models\FoodOrder;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFoodOrderRequest;
use App\Http\Requests\UpdateFoodOrderRequest;

class FoodOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFoodOrderRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(FoodOrder $foodOrder)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FoodOrder $foodOrder)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFoodOrderRequest $request, FoodOrder $foodOrder)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FoodOrder $foodOrder)
    {
        //
    }
}
