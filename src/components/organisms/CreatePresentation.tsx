/* eslint-disable no-unused-vars */
import { Product } from "$store/slices/productsSlice";
import { Button } from "antd";
import { Dispatch, FC, SetStateAction, useState } from "react";

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
  const [savingPresentation, setSavingPresentation] = useState<boolean>(false);

  return (
    <div>
      <div className="flex gap-2">
        <Button
          disabled={savingPresentation}
          onClick={() => setShowModal(false)}
        >
          Cancelar
        </Button>
        <Button
          type="primary"
          loading={savingPresentation}
          onClick={() => console.log("s")}
        >
          Guardar
        </Button>
      </div>
    </div>
  );
};

export default CreatePresentation;
