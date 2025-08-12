<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\NewsImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class NewsController extends Controller
{
    // Get all news with images
    public function index()
    {
        return response()->json(News::with('images')->latest()->get());
    }

    // Create new news with images
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_fr' => 'required|string|max:255',
            'title_ar' => 'required|string|max:255',
            'content_fr' => 'required|string',
            'content_ar' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'extra_images' => 'nullable|array',
            'extra_images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // Store main image
        $imagePath = $request->hasFile('image')
            ? $request->file('image')->store('news_images', 'public')
            : null;

        // Create news record
        $news = News::create([
            'title_fr' => $validated['title_fr'],
            'title_ar' => $validated['title_ar'],
            'content_fr' => $validated['content_fr'],
            'content_ar' => $validated['content_ar'],
            'image' => $imagePath,
        ]);
        Log::info('News created:', $news->toArray());

        // Store extra images if any
        if ($request->hasFile('extra_images')) {
            foreach ($request->file('extra_images') as $image) {
                $newsImage = new NewsImage([
                    'news_id' => $news->id,
                    'image' => $image->store('news_images', 'public'),
                ]);
                $newsImage->save();
                Log::info('Extra NewsImage saved:', $newsImage->toArray());
            }
        }

        return response()->json([
            'message' => 'News created successfully',
            'data' => $news->load('images'),
        ], 201);
    }

    // Show single news with images
    public function show($id)
    {
        $news = News::with('images')->findOrFail($id);
        return response()->json($news);
    }

    // Update news with optional image updates
    public function update(Request $request, $id)
    {
        \Log::info('Update request', $request->all());
        $news = News::findOrFail($id);

        $news->update([
            'title_fr' => $request->title_fr,
            'title_ar' => $request->title_ar,
            'content_fr' => $request->content_fr,
            'content_ar' => $request->content_ar,
        ]);

        return response()->json(['message' => 'News updated successfully', 'data' => $news]);
    }

    // Delete news and all images
    public function destroy($id)
    {
        $news = News::with('images')->findOrFail($id);

        // Delete main image
        if ($news->image) {
            Storage::disk('public')->delete($news->image);
        }

        // Delete extra images
        foreach ($news->images as $image) {
            Storage::disk('public')->delete($image->image);
            $image->delete();
        }

        $news->delete();

        return response()->json(['message' => 'News deleted successfully']);
    }
}
