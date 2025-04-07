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
                var jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "courses.json");
                var jsonData = await System.IO.File.ReadAllTextAsync(jsonPath);

                var fullPrompt = $"{request.Prompt}\n\n```json\n{jsonData}\n```";
                var result = await _geminiService.GenerateTextAsync(fullPrompt);

                var match = Regex.Match(result, @"```json\s*(.*?)\s*```", RegexOptions.Singleline);
                if (match.Success)
                {
                    var extractedJson = match.Groups[1].Value;
                    using var doc = JsonDocument.Parse(extractedJson);
                    var safeJson = JsonDocument.Parse(doc.RootElement.GetRawText()).RootElement;
                    return Ok(safeJson);

                }

                return Ok(new { response = result });
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