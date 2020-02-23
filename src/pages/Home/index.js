import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MdAddShoppingCart } from 'react-icons/md';
import { AiOutlineLoading } from 'react-icons/ai';
import { formatPrice } from '../../util/format';
import api from '../../services/api';

import * as CartActions from '../../store/modules/cart/actions';

import { ProductList, LoadingContainer } from './styles';

class Home extends Component {
  state = {
    products: [],
    loadingProducts: false,
    loadingButton: false,
  };

  async componentDidMount() {
    this.setState({ loadingProducts: true });
    const response = await api.get('products');

    const data = response.data.map(product => ({
      ...product,
      priceFormatted: formatPrice(product.price),
    }));

    this.setState({ products: data, loadingProducts: false });
  }

  handleAddProduct = id => {
    const { addToCartRequest } = this.props;
    this.setState({ loadingButton: true });

    addToCartRequest(id);
  };

  render() {
    const { products, loadingProducts, loadingButton } = this.state;
    const { amount } = this.props;
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
            <button
              type="button"
              onClick={() => this.handleAddProduct(product.id)}
            >
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
}

const mapStateToProps = state => ({
  amount: state.cart.reduce((amount, product) => {
    amount[product.id] = product.amount;

    return amount;
  }, {}),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
