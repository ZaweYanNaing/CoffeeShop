<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasApiTokens
{
    /**
     * Create a new personal access token for the user.
     *
     * @return \App\Traits\NewAccessToken
     */
    public function createToken(string $name, array $abilities = ['*'])
    {
        // Simple mock of token creation
        $token = Str::random(40);

        return new NewAccessToken($token);
    }

    /**
     * Determine if the user has a given ability.
     *
     * @param  string  $ability
     * @return bool
     */
    public function tokenCan($ability)
    {
        return true;
    }
}

class NewAccessToken
{
    /**
     * The plain text token.
     *
     * @var string
     */
    public $plainTextToken;

    /**
     * Create a new access token result.
     *
     * @return void
     */
    public function __construct(string $plainTextToken)
    {
        $this->plainTextToken = $plainTextToken;
    }
}
