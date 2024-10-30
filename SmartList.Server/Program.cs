using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SmartList.Server.Data.Contexts;
using SmartList.Server.Entities;
using SmartList.Server.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddIdentity<User, IdentityRole<Guid>>().AddEntityFrameworkStores<DataContext>()
    .AddDefaultTokenProviders();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<UserService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add JWT authentication:
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey =
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? string.Empty))
    };
});
builder.Services.AddAuthorization();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Add special handling for /main path
app.MapWhen(context => context.Request.Path.StartsWithSegments("/main"), mainApp =>
{
    mainApp.UseStaticFiles();
    mainApp.UseRouting();
    mainApp.UseAuthentication();
    mainApp.UseAuthorization();
    
    mainApp.Use(async (context, next) =>
    {
        if (!context.Request.Path.Value.Contains('.'))
        {
            context.Request.Path = "/main/index.html";
        }
        await next();
    });

    // Add endpoints middleware and fallback for main app
    mainApp.UseEndpoints(endpoints =>
    {
        endpoints.MapFallback(context =>
        {
            context.Request.Path = "/main/index.html";
            return context.Response.SendFileAsync(Path.Combine(app.Environment.WebRootPath, "main", "index.html"));
        });
    });
});

// Regular routes and middleware for the host app
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Default SPA fallback for the host app
app.MapFallbackToFile("/index.html");

app.Run();