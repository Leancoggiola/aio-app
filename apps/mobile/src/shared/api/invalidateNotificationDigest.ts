import { API_KEYS } from './keys';

type RevalidateMutator = (key: string, data?: undefined, options?: { revalidate: boolean }) => Promise<unknown>;

export async function invalidateNotificationDigest(mutate: RevalidateMutator) {
  await mutate(API_KEYS.notifications.digest, undefined, { revalidate: true });
}
