<?php

namespace App\Policies;

use App\Models\BlogPosts;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class PostPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->can('view posts');
    }

    public function view(User $user, BlogPosts $post): bool
    {
        return $user->can('view posts');
    }

    public function create(User $user): bool
    {
        return $user->can('create posts');
    }

    public function update(User $user, BlogPosts $post): bool
    {
        return $user->can('edit posts') &&
            ($user->id === $post->user_id || $user->hasRole('admin'));
    }

    public function delete(User $user, BlogPosts $post): bool
    {
        return $user->can('delete posts') &&
            ($user->id === $post->user_id || $user->hasRole('admin'));
    }
}
