<?php

Route::get('/menu-items', function(Request $request) {
    return \App\Models\MenuItem::where('restaurant_id', $request->restaurant_id)->get();
});