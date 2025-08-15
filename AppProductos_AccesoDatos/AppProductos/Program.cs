using AppProductos;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Agregar DbContext con MySQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("MySqlConnection"),
    ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("MySqlConnection"))));

// Agrega la política de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3002") // o el dominio del frontend en producción
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Configurar Health Checks
builder.Services.AddHealthChecks()
    .AddMySql(
        connectionString: "server=db-mysql-productos_b;port=3306;database=productosdb;user=root;password=Password123",
        name: "MySQL", // Nombre del check
        failureStatus: HealthStatus.Unhealthy
    );

    
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseHealthChecks("/health");  // Endpoint de salud

// Usa la política CORS antes de cualquier endpoint
app.UseCors("AllowFrontend");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
