using backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GeminiController : ControllerBase
    {
        private readonly GeminiService _geminiService;

        public GeminiController(GeminiService geminiService)
        {
            _geminiService = geminiService;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateText([FromBody] PromptRequest request)
        {
            try
            {
                var jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "schedules.json");
                var jsonData = await System.IO.File.ReadAllTextAsync(jsonPath);

                var fullPrompt = $@"
You are an assistant that helps optimize student course schedules.

A user will provide a list of schedules and a set of preferences (e.g., 'I want early classes', 'minimize commuting', 'prefer classes on Tues/Thurs only').

Your task is to:
- Analyze the provided schedule data.
- Determine the optimal order based on the user's preferences.
- Return your response **strictly in this JSON format**:

{{
  ""answer"": ""<your short explanation for the user>"",
  ""order"": [<ordered list of schedule identifiers or course codes>]
}}

Here is the user’s request:
{request.Prompt}

Here is the list of course schedules (in JSON):
```json
{jsonData}
```";

                var result = await _geminiService.GenerateTextAsync(fullPrompt);

                // Extract the JSON inside the code block
                var match = Regex.Match(result, @"```json\s*(\{.*?\})\s*```", RegexOptions.Singleline);
                if (match.Success)
                {
                    var extractedJson = match.Groups[1].Value.Trim();

                    // Validate the extracted JSON
                    using var doc = JsonDocument.Parse(extractedJson);
                    return Ok(JsonDocument.Parse(doc.RootElement.GetRawText()).RootElement);
                }

                // Fallback if no JSON was found
                return Ok(new { response = result });
            }
            catch (JsonException jsonEx)
            {
                return BadRequest(new { error = "Invalid JSON format from Gemini.", details = jsonEx.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }

    public class PromptRequest
    {
        public string Prompt { get; set; } = string.Empty;
    }
}
