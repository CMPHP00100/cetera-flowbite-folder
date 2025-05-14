"use client";
import "../custom-styles/card.css";
import Link from "next/link";

const ProductCard = ({
  id,
  image,
  title,
  price,
  alt,
  button,
  buttonLink,
  onClick,
}) => {
  return (
    <>
      <div className="product col-12">
        <div className="block">
          <div class="page-wrapper container">
            <div class="page-inner">
              <div class="row">
                <div className="el-container">
                  <div class="el-wrapper">
                    <Link href={`/product/${id}`} className="block">
                      <div class="box-up" onClick={onClick}>
                        <img class="img" src={image} alt={alt} />
                        <div class="img-info">
                          <div class="info-inner">
                            <span class="p-name">{title}</span>
                            <span class="p-company"></span>
                          </div>
                          <div class="a-size">
                            Available sizes :{" "}
                            <span class="size">S , M , L , XL</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div class="box-down">
                      <div class="h-bg">
                        <div class="h-bg-inner"></div>
                      </div>

                      <a class="cart" href="#" onClick={buttonLink}>
                        <span class="price">{price}</span>
                        <span class="add-to-cart">
                          <span class="txt">{button}</span>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ProductCard;
