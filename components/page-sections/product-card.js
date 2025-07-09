"use client";
import "../custom-styles/card.css";
import Link from "next/link";
import Image from "next/image";

const ProductCard = ({
  id,
  image,
  title,
  price,
  spc,
  alt,
  button,
  buttonLink,
  onClick,
}) => {
  return (
    <>
      <div className="product col-12">
        <div className="block">
          <div className="page-wrapper container">
            <div className="page-inner">
              <div className="row">
                <div className="el-container">
                  <div className="el-wrapper">
                    <Link href={`/products/${id}`} className="block">
                      <div className="box-up" onClick={onClick}>
                        <Image className="img" src={image} alt={alt} width={96} height={96} />
                        <div className="img-info">
                          <div className="info-inner">
                            <span className="p-name">{title}</span>
                            <span className="p-company"></span>
                          </div>
                          <div className="a-size">
                            {" "}
                            <span className="colors">{spc}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="box-down">
                      <div className="h-bg">
                        <div className="h-bg-inner"></div>
                      </div>

                      <a className="cart" href={buttonLink}> {/*</div>onClick={}>*/}
                        <span className="price">
                          {price !== undefined && price !== null && price !== '' ? `$${price}` : ''}
                        </span>
                        <span className="add-to-cart">
                          <span className="txt">{button}</span>
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
