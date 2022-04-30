/* eslint-disable @next/next/no-img-element */
import { formatCurrency } from "$helpers/formatCurrency";
import { Presentation, Product } from "$store/slices/productsSlice";
import { Card, Tag, Tooltip, Typography, Button } from "antd";
import { FC, useState } from "react";
import Zoom from "react-medium-image-zoom";
import { PlusOutlined } from "@ant-design/icons";

interface Props {
  product: Product;
  presentation: Presentation;
  addToCart: Function;
}

const { Title, Text } = Typography;

const ProductCard: FC<Props> = ({ product, presentation, addToCart }) => {
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  return (
    <div
      className={`transition-all duration-200 ${
        addedToCart ? "!opacity-50 pointer-events-none select-none" : ""
      }`}
    >
      <Card
        className={"!cursor-default"}
        hoverable
        style={{ width: 180 }}
        cover={
          <Zoom zoomMargin={20}>
            <img alt={presentation.name} src={product.image_link} />
          </Zoom>
        }
      >
        <Card.Meta
          title={product.name}
          description={
            <div className="flex flex-col">
              <Title level={4}>
                Precio: {formatCurrency(presentation.sale_price)}
              </Title>
              <div className="flex flex-wrap gap-2 mb-1">
                <Text>Presentación:</Text>
                <Tag color={presentation.color}>
                  {presentation.name}: {presentation.quantity}{" "}
                  {presentation.quantity > 1 ? "unidades" : "unidad"}
                </Tag>
              </div>
              <Text>Stock: {presentation.stock}</Text>
              <div className="flex justify-end my-3">
                <Tooltip title="Agregar al carrito">
                  <Button
                    className="!w-full"
                    type="primary"
                    onClick={() => {
                      setAddedToCart(true);
                      addToCart();
                    }}
                    icon={<PlusOutlined />}
                  ></Button>
                </Tooltip>
              </div>
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default ProductCard;
