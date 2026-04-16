<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected string $apiKey;

    protected string $apiUrl;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key');
        // Use gemini-2.5-flash - stable version available in the API
        $this->apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
    }

    public function getCoffeeRecommendation(string $userMessage, array $products): string
    {
        try {
            // Check if API key is configured
            if (empty($this->apiKey)) {
                Log::warning('Gemini API key not configured');

                return "I apologize, but I'm having trouble connecting right now. Please try browsing our menu directly or ask our staff for recommendations!";
            }

            $systemPrompt = $this->buildSystemPrompt($products);
            $fullPrompt = "{$systemPrompt}\n\nCustomer: {$userMessage}\n\nAssistant:";

            // API key goes in the URL as a query parameter
            $url = $this->apiUrl.'?key='.$this->apiKey;

            $response = Http::timeout(30)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->post($url, [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $fullPrompt],
                            ],
                        ],
                    ],
                    'generationConfig' => [
                        'temperature' => 0.7,
                        'maxOutputTokens' => 500,
                    ],
                ]);

            if ($response->successful()) {
                $data = $response->json();

                if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                    return $data['candidates'][0]['content']['parts'][0]['text'];
                }

                Log::error('Gemini API - Unexpected response structure', [
                    'data' => $data,
                ]);
            } else {
                Log::error('Gemini API Error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'api_key_present' => ! empty($this->apiKey),
                ]);
            }

            return "I apologize, but I'm having trouble connecting right now. Please try browsing our menu directly or ask our staff for recommendations!";

        } catch (\Exception $e) {
            Log::error('Gemini Service Exception', [
                'message' => $e->getMessage(),
            ]);

            return "I apologize, but I'm having trouble connecting right now. Please try browsing our menu directly or ask our staff for recommendations!";
        }
    }

    protected function buildSystemPrompt(array $products): string
    {
        $menuItems = collect($products)->map(function ($product) {
            $details = [
                "Name: {$product['name']}",
                "Price: \${$product['price']}",
                "Description: {$product['description']}",
            ];

            if ($product['category']) {
                $details[] = "Category: {$product['category']['name']}";
            }

            if ($product['points_reward'] > 0) {
                $details[] = "Rewards: +{$product['points_reward']} points";
            }

            if ($product['points_cost'] > 0) {
                $details[] = "Can be redeemed for: {$product['points_cost']} points";
            }

            return '- '.implode(', ', $details);
        })->join("\n");

        return <<<PROMPT
You are a friendly and knowledgeable AI Coffee Concierge for The Daily Grind, a cozy coffee shop. Your role is to help customers find the perfect drink or food item from our menu based on their preferences.

Our Current Menu:
{$menuItems}

Guidelines:
- Be warm, friendly, and enthusiastic about coffee
- Ask clarifying questions if the customer's request is vague
- Recommend 2-3 specific items from the menu that match their preferences
- Explain why each recommendation fits their needs
- Mention the price and any reward points
- If they ask about dietary restrictions (dairy-free, vegan, etc.), make appropriate suggestions
- If they want something we don't have, politely suggest the closest alternative
- Keep responses concise but helpful (2-4 sentences per recommendation)
- Use a conversational, welcoming tone

Remember: You can only recommend items from the menu above. Don't make up products that don't exist.
PROMPT;
    }
}
