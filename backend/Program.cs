using backend.Services;
using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);
Env.Load();

var geminiApiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY");

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddSingleton<GeminiService>(new GeminiService(geminiApiKey));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();

