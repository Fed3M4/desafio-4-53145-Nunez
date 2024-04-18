const socket=io()


socket.on("enviodeproducts",(obj)=>{
    updateProductList(obj)
})


function updateProductList(products) {
    let div = document.getElementById("list-products");
    let productos = "";
  
    products.forEach((product) => {
      productos += `
          <article class="container">
        <div class="card">
          <div class="contentBx">
            <h2>${product.title}</h2>
            <div class="size">
              <h3>${product.description}</h3>
            </div>
            <div class="color">
              <h3>${product.price}</h3>
            </div>
            <a href="#">Comprar</a>
          </div>
        </div>
        
      </article>
          
          `;
    });
  
    div.innerHTML = productos;
  }


  let form = document.getElementById("formProduct");
form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  let title = form.elements.title.value;
  let description = form.elements.description.value;
  let stock = form.elements.stock.value;
  let thumbnail = form.elements.thumbnail.value;
  let category = form.elements.category.value;
  let price = form.elements.price.value;
  let status = true;

  socket.emit("addProduct", {
    title: title,
    description: description,
    price: price,
    status: status,
    stock: stock,
    category: category,
    thumbnail: thumbnail,
  });

  form.reset();
});

document.getElementById("delete-btn").addEventListener("click", function () {
    const deleteidinput = document.getElementById("id-prod");
    const deleteid = parseInt(deleteidinput.value);
    socket.emit("deleteProduct", deleteid);
    deleteidinput.value = "";
  });