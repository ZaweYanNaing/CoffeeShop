# AI Coffee Concierge Setup Guide

The AI Coffee Concierge feature uses Google's Gemini API to provide intelligent, natural language recommendations to customers.

## Getting Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Select "Create API key in new project" or choose an existing project
5. Copy the generated API key

## Important: API Key Requirements

- Make sure you're using the NEW Google AI Studio (aistudio.google.com), not the old makersuite
- The API key should start with `AIza...`
- Ensure the API key has access to Gemini models
- Free tier has rate limits but should work for testing

## Configuration

1. Open your `.env` file
2. Find the `GEMINI_API_KEY` variable
3. Paste your API key (no quotes needed):
   ```
   GEMINI_API_KEY=AIzaSyABC123...your_actual_key_here
   ```
4. Save the file
5. Clear config cache:
   ```bash
   php artisan config:clear
   ```

## Troubleshooting

### "Model not found" Error

If you see errors about models not being found:

1. **Verify your API key is correct**:
   ```bash
   php artisan tinker --execute="echo config('services.gemini.api_key');"
   ```

2. **Test the API key directly** with curl:
   ```bash
   curl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY_HERE"
   ```
   This should return a list of available models.

3. **Check if your API key has the right permissions**:
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Make sure Gemini API is enabled for your project
   - Try generating a new API key if the current one doesn't work

4. **Regional restrictions**: Some regions may have limited access to Gemini models

### Alternative: Use Mock Mode

If you can't get the Gemini API working, you can modify the service to return mock responses for testing.

## How It Works

The AI Coffee Concierge:
- Appears as a floating chat button on all customer pages (bottom-right corner)
- Analyzes customer requests in natural language
- Recommends specific menu items based on preferences
- Considers dietary restrictions, taste preferences, and drink characteristics
- Only recommends available products from your actual menu

## Example Queries

Customers can ask things like:
- "I want something sweet, iced, and dairy-free"
- "What's your strongest espresso drink?"
- "I need a light, refreshing beverage"
- "Show me vegan options"
- "Something warm and comforting"

## Features

- Real-time chat interface with message history
- Quick prompt suggestions for first-time users
- Loading indicators during API calls
- Graceful error handling
- Mobile-responsive design
- Dark mode support
- Only visible to customers (hidden for admin users)

## Testing

The feature includes comprehensive tests:
```bash
php artisan test --filter=CoffeeConciergeControllerTest
```

## API Endpoint

- **POST** `/api/concierge/chat`
- **Body**: `{ "message": "your question here" }`
- **Response**: `{ "message": "AI response", "timestamp": "ISO8601" }`
- **Public access** (no authentication required)

## Cost Considerations

- Gemini API has a free tier with generous limits (15 requests per minute)
- Each chat message = 1 API call
- Monitor usage in [Google Cloud Console](https://console.cloud.google.com/)
- Consider implementing rate limiting for production use

## Customization

To customize the AI's behavior, edit:
- `app/Services/GeminiService.php` - Modify the system prompt and model
- `resources/js/components/CoffeeConcierge.tsx` - Adjust UI and quick prompts
