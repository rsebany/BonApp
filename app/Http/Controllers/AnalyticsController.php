<?php

namespace App\Http\Controllers;

use App\Models\Analytics;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAnalyticsRequest;
use App\Http\Requests\UpdateAnalyticsRequest;

class AnalyticsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Analytics/index', [
    ]);
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
    public function store(StoreAnalyticsRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Analytics $analytics)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Analytics $analytics)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAnalyticsRequest $request, Analytics $analytics)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Analytics $analytics)
    {
        //
    }
}
