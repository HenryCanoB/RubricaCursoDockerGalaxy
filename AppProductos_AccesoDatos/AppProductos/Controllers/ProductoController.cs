using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AppProductos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/producto
        [HttpGet]
        public async Task<IActionResult> GetAllProductos()
        {
            var productos = await _context.Productos.ToListAsync();
            return Ok(productos);
        }

        // GET: api/producto/{codigo}
        [HttpGet("{codigo}")]
        public async Task<IActionResult> GetProducto(int codigo)
        {
            var producto = await _context.Productos.FindAsync(codigo);
            if (producto == null)
                return NotFound(new { message = $"Producto con código {codigo} no encontrado." });

            return Ok(producto);
        }

        // POST: api/producto
        [HttpPost]
        public async Task<IActionResult> CreateProducto([FromBody] Producto nuevoProducto)
        {
            _context.Productos.Add(nuevoProducto);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProducto), new { codigo = nuevoProducto.Codigo }, nuevoProducto);
        }

        // PUT: api/producto/{codigo}
        [HttpPut("{codigo}")]
        public async Task<IActionResult> UpdateProducto(int codigo, [FromBody] Producto productoActualizado)
        {
            var producto = await _context.Productos.FindAsync(codigo);
            if (producto == null)
                return NotFound(new { message = $"Producto con código {codigo} no encontrado." });

            producto.Descripcion = productoActualizado.Descripcion;
            producto.Precio = productoActualizado.Precio;
            producto.Cantidad = productoActualizado.Cantidad;
            producto.Activo = productoActualizado.Activo;

            await _context.SaveChangesAsync();
            return Ok(producto);
        }

        // DELETE: api/producto/{codigo}
        [HttpDelete("{codigo}")]
        public async Task<IActionResult> DeleteProducto(int codigo)
        {
            var producto = await _context.Productos.FindAsync(codigo);
            if (producto == null)
                return NotFound(new { message = $"Producto con código {codigo} no encontrado." });

            producto.Activo = false;
            await _context.SaveChangesAsync();

            return Ok(producto);
        }



    }
}
