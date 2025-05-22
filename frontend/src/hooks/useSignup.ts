import { useState } from "react";

const useSignup = () => {
  const [loading] = useState(false);

  return { loading };
}

export default useSignup;