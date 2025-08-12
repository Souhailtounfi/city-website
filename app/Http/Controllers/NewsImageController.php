<?php

namespace App\Http\Controllers;

use App\Models\NewsImage;
use Illuminate\Support\Facades\Storage;

class NewsImageController extends Controller
{
    // Delete single extra image
    public function destroy($id)
    {
        $image = NewsImage::findOrFail($id);

        // Delete image file
        if ($image->image) {
            Storage::disk('public')->delete($image->image);
        }

        $newsId = $image->news_id;
        $image->delete();
        \Log::info('NewsImage deleted:', ['id' => $id, 'news_id' => $newsId]);

        return response()->json([
            'message' => 'Extra image deleted successfully',
            'news_id' => $newsId
        ]);
    }
}