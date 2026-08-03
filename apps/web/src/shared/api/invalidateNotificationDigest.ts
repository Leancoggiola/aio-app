import { SWR_KEYS } from './keys';

type RevalidateMutator = (key: string, data?: undefined, options?: { revalidate: boolean }) => Promise<unknown>;

export async function invalidateNotificationDigest(mutate: RevalidateMutator) {
  await mutate(SWR_KEYS.notifications.digest, undefined, { revalidate: true });
}
