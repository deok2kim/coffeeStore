import ProductListPage from "./components/ProductListPage.js";
import ProductDetailPage from "./components/ProductDetailPage.js";
import CartPage from "./components/CartPage.js";
import { init } from "./router.js";

export default function ({ $target }) {
  this.route = () => {
    const { pathname } = location;

    $target.innerHTML = "";
    if (pathname === "/") {
      new ProductListPage({ $target }).render();
    } else if (pathname.indexOf("/products/") === 0) {
      const [, , productId] = pathname.split("/");
      new ProductDetailPage({
        $target,
        productId,
      }).render();
    } else if (pathname === "/cart") {
      new CartPage({ $target }).render();
    } else {
      return null;
    }
  };

  init(this.route);

  this.route();

  window.addEventListener("popstate", this.route);
}
