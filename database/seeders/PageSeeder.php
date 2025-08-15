<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Page;

class PageSeeder extends Seeder {
  public function run(): void {
    Page::updateOrCreate(
      ['slug'=>'apercu-historique'],
      [
        'title_fr' => 'I. Aperçu Historique',
        'title_ar' => 'لمحة تاريخية',
        'content_fr' => nl2br("
EL HAJEB aurait tiré son nom actuel de deux légendes :
• Historiquement, cette Province constituait une enclave protectrice de la capitale ismaélite.
• Géographiquement, le relief montagneux d'EL HAJEB, sculpté par l'érosion, a toujours constitué des « sourcils » naturels (HAJEBS) pour les deux principales sources « Ain Madani » et « Ain Khadem ».

Dans le cadre des projets programmés du FSDR (Fonds Spécial pour le Développement Rural) institué à la suite du Discours de Feu Sa Majesté Hassan II à Erfoud en 1974, la ville d'EL HAJEB, non encore érigée en Province, avait bénéficié d'un projet financé par la Banque Mondiale visant à développer l'agriculture en Bour sur le plateau d'EL HAJEB.

Mais c'est à partir de 1991 que le cercle d'EL HAJEB, érigé en Province, a commencé à drainer ses premiers investissements en matière d'infrastructures de base.
"),
        'content_ar' => '... (ترجمة عربية يمكن إضافتها لاحقاً) ...',
        'extra' => null
      ]
    );

    Page::updateOrCreate(
      ['slug'=>'situation-geographique'],
      [
        'title_fr' => 'II. Situation Géographique',
        'title_ar' => 'الموقع الجغرافي',
        'content_fr' => nl2br("Section destinée à présenter la situation géographique de la Province d’El Hajeb. Vous pouvez insérer la carte interactive ci-dessous."),
        'content_ar' => 'قسم مخصص لعرض الموقع الجغرافي لإقليم الحاجب مع خريطة تفاعلية بالأسفل.',
        'extra' => ['map_url' => ''] // Admin remplira plus tard
      ]
    );
  }
}