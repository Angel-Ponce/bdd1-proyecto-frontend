/* eslint-disable @next/next/no-img-element */
import { FC, useState } from "react";
import { CartProduct } from "src/pages/[sales]/new";
import Zoom from "react-medium-image-zoom";
import { InputNumber, Slider, Tag, Typography } from "antd";
import { formatCurrency } from "$helpers/formatCurrency";

const { Title, Text } = Typography;

interface CartItemChangeInterface {
  quantity: number;
  subTotal: number;
}
interface Props {
  item: CartProduct;
  onChange?: (e: CartItemChangeInterface) => void;
}

const CartItem: FC<Props> = ({ item, onChange }) => {
  const [inputValue, setInputValue] = useState<number>(1);
  const [subTotal, setSubtotal] = useState<number>(
    item.presentation.sale_price
  );

  const onQuantityChange = (quantity: number) => {
    setInputValue(quantity);

    setSubtotal(quantity * item.presentation.sale_price);

    if (onChange) {
      onChange({
        quantity,
        subTotal: quantity * item.presentation.sale_price,
      });
    }
  };

  const sliderMarks = {
    [item.presentation.stock]: {
      style: {
        color: "#f50",
      },
      label: <strong>Stock</strong>,
    },
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-5">
        <Zoom zoomMargin={20}>
          <img
            width={70}
            src={item.product.image_link}
            alt={item.product.name}
          />
        </Zoom>

        <div className="flex flex-col">
          <Title level={5}>{item.product.name}</Title>
          <Tag color={item.presentation.color} className="w-fit">
            {item.presentation.name}: {item.presentation.quantity}{" "}
            {item.presentation.quantity > 1 ? "unidades" : "unidad"}
          </Tag>
          <div className="mt-2">
            <Text>
              Precio unitario: {formatCurrency(item.presentation.sale_price)}
            </Text>
          </div>
          <div className="mt-2">
            <Text>Subtotal: {formatCurrency(subTotal)}</Text>
          </div>
        </div>
      </div>

      <div className="w-full flex gap-4 mt-2">
        <div className="w-full">
          <Slider
            marks={sliderMarks}
            min={1}
            max={item.presentation.stock}
            onChange={onQuantityChange}
            value={typeof inputValue === "number" ? inputValue : 0}
          />
        </div>

        <div>
          <InputNumber
            min={1}
            max={item.presentation.stock}
            style={{ margin: "0 16px" }}
            value={inputValue}
            onChange={onQuantityChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CartItem;
