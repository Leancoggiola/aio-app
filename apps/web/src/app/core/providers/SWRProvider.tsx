import { FC, PropsWithChildren } from "react";
import { SWRConfig } from "swr";

import { fetcher } from "@/common/api";

export const SWRProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  );
};
