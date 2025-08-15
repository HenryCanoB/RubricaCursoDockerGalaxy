using System.ComponentModel.DataAnnotations;

namespace AppProductos
{
    public class Producto
    {
        [Key]
        public int Codigo { get; set; }

        public string Descripcion { get; set; }

        public decimal Precio { get; set; }

        public int Cantidad { get; set; }

        public bool Activo { get; set; }
    }
}
