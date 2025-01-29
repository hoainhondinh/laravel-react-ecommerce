<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Sitemap\SitemapGenerator;
use Spatie\Sitemap\Tags\Url;
use App\Models\BlogPost;
use App\Models\BlogCategory;
use App\Models\BlogTag;
use Carbon\Carbon;

class GenerateSitemap extends Command
{
    protected $signature = 'sitemap:generate';
    protected $description = 'Generate the sitemap';

    public function handle()
    {
        $this->info('Generating sitemap...');

        $sitemap = SitemapGenerator::create(config('app.url'))
            ->getSitemap();

        // Add Blog Posts to sitemap
        $this->info('Adding blog posts...');
        BlogPost::where('status', 'published')
            ->where('published_at', '<=', now())
            ->get()
            ->each(function (BlogPost $post) use ($sitemap) {
                $sitemap->add(Url::create(route('blog.show', $post->slug))
                    ->setLastModificationDate($post->updated_at)
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                    ->setPriority(0.8));
            });

        // Add Blog Categories to sitemap
        $this->info('Adding blog categories...');
        BlogCategory::all()->each(function (BlogCategory $category) use ($sitemap) {
            $sitemap->add(Url::create(route('blog.category', $category->slug))
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY)
                ->setPriority(0.7));
        });

        // Add Blog Tags to sitemap
        $this->info('Adding blog tags...');
        BlogTag::all()->each(function (BlogTag $tag) use ($sitemap) {
            $sitemap->add(Url::create(route('blog.tag', $tag->slug))
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY)
                ->setPriority(0.6));
        });

        // Add Blog index page
        $this->info('Adding blog index page...');
        $sitemap->add(Url::create(route('blog.index'))
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
            ->setPriority(0.9));

        $sitemap->writeToFile(public_path('sitemap.xml'));

        $this->info('Sitemap generated successfully at public/sitemap.xml!');

        return Command::SUCCESS;
    }
}
