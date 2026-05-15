import { prisma } from "../common/db";

export async function getStats(userId: string) {
  let stats = await prisma.userStats.findUnique({
    where: { userId },
  });

  if (!stats) {
    stats = await recalculateStats(userId);
  }

  return stats;
}

export async function recalculateStats(userId: string) {
  const items = await prisma.mediaItem.findMany({
    where: { userId },
    select: { mediaType: true, status: true },
  });

  let totalMovies = 0;
  let totalTvShows = 0;
  let totalWatched = 0;
  let totalWatching = 0;
  let totalToWatch = 0;

  for (const item of items) {
    if (item.mediaType === "movie") totalMovies++;
    if (item.mediaType === "tv") totalTvShows++;
    if (item.status === "watched") totalWatched++;
    if (item.status === "watching") totalWatching++;
    if (item.status === "to_watch") totalToWatch++;
  }

  return prisma.userStats.upsert({
    where: { userId },
    create: {
      userId,
      totalMovies,
      totalTvShows,
      totalWatched,
      totalWatching,
      totalToWatch,
    },
    update: {
      totalMovies,
      totalTvShows,
      totalWatched,
      totalWatching,
      totalToWatch,
    },
  });
}
