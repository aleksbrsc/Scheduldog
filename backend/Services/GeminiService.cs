using RestSharp;
using System.Text.Json;
using System.Threading.Tasks;

namespace backend.Services
{
    public class GeminiService
    {
        private readonly RestClient _client;
        private readonly string _apiKey;

        public GeminiService(string apiKey)
        {
            _apiKey = apiKey;
            _client = new RestClient("https://generativelanguage.googleapis.com/");
        }

        public async Task<string> GenerateTextAsync(string prompt)
        {
            var request = new RestRequest("v1beta/models/gemini-1.5-pro-002:generateContent", Method.Post);
            request.AddQueryParameter("key", _apiKey);

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                }
            };

            request.AddJsonBody(requestBody);

            var response = await _client.ExecuteAsync(request);

            if (!response.IsSuccessful)
                return $"Error: {response.StatusCode} - {response.Content}";

            using var jsonDoc = JsonDocument.Parse(response.Content!);
            var root = jsonDoc.RootElement;
            var text = root
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString();

            return text ?? "No text found.";

        }
    }
}
