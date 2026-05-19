import { FC, PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';

import { fetcher } from '@/shared/api';

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
