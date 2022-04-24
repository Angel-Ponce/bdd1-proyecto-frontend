import { Provider } from "$store/slices/providersSlice";
import { Dispatch, FC, SetStateAction } from "react";

interface Props {
  provider: Provider;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const EditProvider: FC<Props> = ({ provider, setShowModal }) => {
  return <div onClick={() => setShowModal(false)}>{provider.name}</div>;
};

export default EditProvider;
