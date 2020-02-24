import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MdAddShoppingCart } from 'react-icons/md';
import { AiOutlineLoading } from 'react-icons/ai';
import { formatPrice } from '../../util/format';
import api from '../../services/api';

import * as CartActions from '../../store/modules/cart/actions';

import { ProductList, LoadingContainer } from './styles';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  const amount = useSelector(state =>
    state.cart.reduce((sumAmount, product) => {
      sumAmount[product.id] = product.amount;

      return sumAmount;
    }, {})
  );

  const dispatch = useDispatch();

  useEffect(() => {
    async function loadProducts() {
      setLoadingProducts(true);
      const response = await api.get('products');

      const data = response.data.map(product => ({
        ...product,
        priceFormatted: formatPrice(product.price),
      }));

      setProducts(data);
      setLoadingProducts(false);
    }

    loadProducts();
  }, []);

  function handleAddProduct(id) {
    dispatch(CartActions.addToCartRequest(id));
  }

  if (loadingProducts) {
    return (
      <LoadingContainer loadingProducts={loadingProducts}>
        <AiOutlineLoading size={80} color="#FFF" />
      </LoadingContainer>
    );
  }

  return (
    <ProductList loading={loadingProducts} loadingButton={loadingButton}>
      {products.map(product => (
        <li key={String(product.id)}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{product.priceFormatted}</span>
          <button type="button" onClick={() => handleAddProduct(product.id)}>
            <div>
              <MdAddShoppingCart size={16} color="#FFF" />{' '}
              {amount[product.id] || 0}
            </div>

            <span>
              {loadingButton ? (
                <AiOutlineLoading size={14} color="#FFF" />
              ) : (
                'ADICIONAR AO CARRINHO'
              )}
            </span>
          </button>
        </li>
      ))}
    </ProductList>
  );
}
