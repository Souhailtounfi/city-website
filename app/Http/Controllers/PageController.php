<?php
namespace App\Http\Controllers;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PageController extends Controller
{
  public function index() {
    return Page::select('slug','title_fr','title_ar','updated_at')->orderBy('slug')->get();
  }

  public function show(string $slug) {
    $page = Page::where('slug',$slug)->first();
    if(!$page){
      return response()->json(['message'=>'Not Found'],404);
    }
    $extra = $page->extra ?? [];
    if(isset($extra['gallery']) && is_array($extra['gallery'])){
      $extra['gallery_full'] = array_map(fn($p)=>Storage::url($p), $extra['gallery']);
    }
    $page->extra = $extra;
    return $page;
  }

  public function store(Request $request) {
    $this->authorizeAdmin($request);
    $data = $request->validate([
      'slug'       => 'required|string|alpha_dash|unique:pages,slug',
      'title_fr'   => 'nullable|string|max:255',
      'title_ar'   => 'nullable|string|max:255',
      'content_fr' => 'nullable|string',
      'content_ar' => 'nullable|string',
      'extra'      => 'nullable|array'
    ]);
    $page = Page::create($data);
    return response()->json($page,201);
  }

  public function update(Request $request, string $slug) {
    $this->authorizeAdmin($request);
    $page = Page::where('slug',$slug)->firstOrFail();
    $data = $request->validate([
      'title_fr'   => 'nullable|string|max:255',
      'title_ar'   => 'nullable|string|max:255',
      'content_fr' => 'nullable|string',
      'content_ar' => 'nullable|string',
      'extra'      => 'nullable|array'
    ]);
    $page->update($data);
    return $page->fresh();
  }

  public function addGalleryImage(Request $request, string $slug) {
    $this->authorizeAdmin($request);
    $page = Page::where('slug',$slug)->firstOrFail();
    $request->validate([
      'image' => 'required|image|max:4096'
    ]);
    $path = $request->file('image')->store('page_galleries','public');

    $extra = $page->extra ?? [];
    $gallery = $extra['gallery'] ?? [];
    $gallery[] = $path;
    $extra['gallery'] = $gallery;
    $page->extra = $extra;
    $page->save();

    return response()->json(['gallery'=>$gallery]);
  }

  public function deleteGalleryImage(Request $request, string $slug, int $index) {
    $this->authorizeAdmin($request);
    $page = Page::where('slug',$slug)->firstOrFail();
    $extra = $page->extra ?? [];
    $gallery = $extra['gallery'] ?? [];
    if (!isset($gallery[$index])) {
      return response()->json(['message'=>'Not Found'],404);
    }
    $removed = $gallery[$index];
    unset($gallery[$index]);
    $gallery = array_values($gallery);
    $extra['gallery'] = $gallery;
    $page->extra = $extra;
    $page->save();
    // (Optionnel) Storage::disk('public')->delete($removed);
    return response()->json(['gallery'=>$gallery]);
  }

  private function authorizeAdmin(Request $r){
    $u = $r->user();
    abort_unless($u && $u->is_admin, 403);
  }
}