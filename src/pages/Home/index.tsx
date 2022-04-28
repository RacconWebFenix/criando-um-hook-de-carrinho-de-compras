import React, { useState, useEffect } from "react";
import { MdAddShoppingCart } from "react-icons/md";

import { ProductList } from "./styles";
import { api } from "../../services/api";
import { formatPrice } from "../../util/format";
import { useCart } from "../../hooks/useCart";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();
  const cartItemsAmount = cart?.reduce((sumAmount, product) => {
    const newSumAmount = { ...sumAmount };
    // o sumAmount é um Objeto {} e nao um array [] por isso é criado um novo objeto com o operador ... spread
    // esse tipo de nomenclatura objeto[obj.id] não significa que
    //o primeiro ojeto é um array.
    //Na verdade isso Objeto[product.id]
    //busca a chave de um objeto de forma dinamica onde o valor
    //dentro de [product.id] é igual ao valor da chave de objeto
    //por exemplo objeto { chave = 5 } [product.id === 5]
    newSumAmount[product.id] = product.amount;
    return newSumAmount;
  }, {} as CartItemsAmount);

  useEffect(() => {
    async function loadProducts() {

      //é possivel aplicar a tipagem quando o produto chega pelo get <Product[ ]>
      const response = await api.get<Product[]>("products");
      const data = response.data.map((p) => {
        return {
          ...p,
          priceFormatted: formatPrice(p.price),
        };
      });
      setProducts(data);
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id);
  }

  return (
    <ProductList>
      {products.map((p) => {
        return (
          <li key={p.id}>
            <img src={p.image} alt={p.title} />
            <strong>{p.title}</strong>
            <span>{p.priceFormatted}</span>
            <button
              type="button"
              data-testid="add-product-button"
              onClick={() => handleAddProduct(p.id)}
            >
              <div data-testid="cart-product-quantity">
                <MdAddShoppingCart size={16} color="#FFF" />
                {cartItemsAmount[p.id] || 0}
              </div>

              <span>ADICIONAR AO CARRINHO</span>
            </button>
          </li>
        );
      })}
    </ProductList>
  );
};

export default Home;
