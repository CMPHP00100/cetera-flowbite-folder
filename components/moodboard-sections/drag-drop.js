"use client";

import { useDrag } from "react-dnd";
import Image from "next/image";

export default function DraggableProduct({ product }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "PRODUCT",
    item: {
      id: product.id,
      name: product.name,
      image: product.thumbPic,
      spc: product.spc,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`cursor-pointer rounded-lg border p-2 ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="row inline">
        <div className="col-sm-2">
          <Image
            src={product.thumbPic}
            alt={product.name}
            className="h-24 w-24"
            width={96}
            height={96}
          />{" "}
        </div>
        <div className="col-sm-10 text-sm">
          <p>{product.name}</p>
          <p>{product.spc}</p>
        </div>
      </div>
    </div>
  );
}
