import { getItem, setItem } from "../storage.js";
import { routeChange } from "../router.js";
import { parsingPrice } from "../common.js";

export default function ({ $target, initialState }) {
  const $component = document.createElement("div");
  $target.appendChild($component);

  this.state = initialState;

  this.getTotalPrice = () => {
    const { product, selectedOptions } = this.state;
    const { price: productPrice } = product;

    return selectedOptions.reduce(
      (acc, option) =>
        acc + (productPrice + option.optionPrice) * option.quantity,
      0
    );
  };

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    const { product, selectedOptions = [] } = initialState;
    if (product && selectedOptions) {
      $component.innerHTML = `
				<h3>선택된 상품</h3>
				<ul>
					${selectedOptions
            .map(
              (selectedOption) => `
						<li>
							${selectedOption.optionName} ${parsingPrice(
                product.price + selectedOption.optionPrice
              )}원
							<input type="text" data-option-id="${selectedOption.optionId}" value="${
                selectedOption.quantity
              }" />
						</li>
					`
            )
            .join("")}
				</ul>
				<div class="ProductDetail__totalPrice">${parsingPrice(
          this.getTotalPrice()
        )}원</div>
				<button class="OrderButton">주문하기</button>
			`;
    }
  };

  this.render();

  $component.addEventListener("change", (e) => {
    if (e.target.tagName === "INPUT") {
      try {
        const nextQuantity = parseInt(e.target.value);
        const nextSelectedOptions = [...this.state.selectedOptions];

        if (typeof nextQuantity === "number") {
          const { product } = this.state;
          const optionId = parseInt(e.target.dataset.optionId);
          const option = product.productOptions.find(
            (option) => option.id === optionId
          );
          const selectedOptionIndex = nextSelectedOptions.findIndex(
            (selectedOption) => selectedOption.optionId === optionId
          );
          nextSelectedOptions[selectedOptionIndex].quantity =
            option.stock >= nextQuantity ? nextQuantity : option.stock;

          this.setState({
            ...this.state,
            selectedOptions: nextSelectedOptions,
          });
        }
      } catch (error) {
        alert(error.message);
      }
    }
  });

  $component.addEventListener("click", (e) => {
    if (e.target.className === "OrderButton") {
      const { selectedOptions } = this.state;
      const cartData = getItem("products_cart", []);
      setItem(
        "products_cart",
        cartData.concat(
          selectedOptions.map((selectedOption) => ({
            productId: selectedOption.productId,
            optionId: selectedOption.optionId,
            quantity: selectedOption.quantity,
          }))
        )
      );

      routeChange("/cart");
    }
  });
}
