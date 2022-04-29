import { Product } from "$store/slices/productsSlice";
import { Dispatch, FC, SetStateAction } from "react";

interface Props {
  modalType: "create" | "edit";
  product: Product | null;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const CreatePresentation: FC<Props> = ({
  modalType,
  product,
  setShowModal,
}) => {
  return <h1>{modalType == "create" ? "CREAR" : "EDIT"}</h1>;
};

export default CreatePresentation;
