import { FC, PropsWithChildren } from "react";
import { SWRConfig } from "swr";
import { fetcher } from "../../../lib/fetcher";

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
