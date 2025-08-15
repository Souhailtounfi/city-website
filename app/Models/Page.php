<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Page extends Model {
  protected $fillable = [
    'slug','title_fr','title_ar','content_fr','content_ar','extra'
  ];
  protected $casts = ['extra'=>'array'];
}