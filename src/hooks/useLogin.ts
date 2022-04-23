import { useEffect, useState } from "react";
import { useAppDispatch } from "$hooks/useAppDispatch";
import { useAppSelector } from "$hooks/useAppSelector";
import ls from "store2";
import { login } from "$store/slices/userSlice";

const useLogin = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    if (!user.loggedIn) {
      const user = ls.get("amabiscaUser");
      dispatch(login(user));
    }
    setMounted(true);
  }, [user, dispatch]);

  return [user.loggedIn, mounted];
};

export { useLogin };
