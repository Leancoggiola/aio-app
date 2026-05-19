import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const BCRYPT_ROUNDS = 12;

async function main() {
  // ============================================
  // INITIALIZATION
  // ============================================
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = !isProduction;

  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({ adapter });

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    console.log('⚠️  ADMIN_USERNAME and ADMIN_PASSWORD env vars not set. Skipping admin seed.');
    await prisma.$disconnect();
    return;
  }

  const hashedAdminPassword = await bcrypt.hash(adminPassword, BCRYPT_ROUNDS);
  const defaultPassword = isDevelopment ? await bcrypt.hash('password123', BCRYPT_ROUNDS) : null;

  console.log(`\n🌍 Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);

  // ============================================
  // SECTION 1: USERS
  // ============================================
  // Create or get admin user (both dev and prod)
  let adminUser = await prisma.user.findUnique({
    where: { username: adminUsername.toLowerCase() },
  });

  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        username: adminUsername.toLowerCase(),
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedAdminPassword,
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin user created.');
  } else {
    console.log('ℹ️  Admin user already exists.');
  }

  const createdUsers = [adminUser];

  // Create test users only in development
  if (isDevelopment) {
    const testUsers = [
      { username: 'user1', name: 'Juan Pérez', email: 'juan@example.com' },
      { username: 'user2', name: 'María García', email: 'maria@example.com' },
    ];

    for (const userData of testUsers) {
      const existing = await prisma.user.findUnique({
        where: { username: userData.username },
      });

      if (!existing) {
        const newUser = await prisma.user.create({
          data: {
            ...userData,
            password: defaultPassword!,
            role: 'USER',
          },
        });
        createdUsers.push(newUser);
        console.log(`✅ Test user '${userData.username}' created.`);
      } else {
        createdUsers.push(existing);
        console.log(`ℹ️  Test user '${userData.username}' already exists.`);
      }
    }
  } else {
    console.log('ℹ️  Skipping test users (production environment).');
  }

  // ============================================
  // SECTION 2: USER PREFERENCES
  // ============================================
  for (const user of createdUsers) {
    const existingPrefs = await prisma.userPreferences.findUnique({
      where: { userId: user.id },
    });

    if (!existingPrefs) {
      await prisma.userPreferences.create({
        data: {
          userId: user.id,
          notifications: user.role === 'ADMIN',
        },
      });
    }
  }
  console.log('✅ User preferences created/verified.');

  // ============================================
  // SECTION 3: SAMPLE MEDIA ITEMS (Development only)
  // ============================================
  if (isDevelopment) {
    const sampleMedia = [
      {
        tmdbId: 550,
        mediaType: 'movie',
        title: 'Fight Club',
        posterPath: '/pB8BM7pdSp6B6Ih7QZ7XjsKwYP2.jpg',
        status: 'watched',
      },
      {
        tmdbId: 278,
        mediaType: 'movie',
        title: 'The Shawshank Redemption',
        posterPath: '/q6y0aVAvFx3bnlsHX4mOnMZo6v.jpg',
        status: 'watched',
      },
      {
        tmdbId: 155,
        mediaType: 'movie',
        title: 'The Dark Knight',
        posterPath: '/1hRoyzDtpgMU7Dz4IEIqq2kTrCl.jpg',
        status: 'watching',
      },
      {
        tmdbId: 27205,
        mediaType: 'movie',
        title: 'Inception',
        posterPath: '/pg8JQWLFKtaueRXSBjM0cAawykL.jpg',
        status: 'to_watch',
      },
      {
        tmdbId: 1399,
        mediaType: 'tv',
        title: 'Game of Thrones',
        posterPath: '/u3bZgnrm2E0BlzYrNeEc53OVVmU.jpg',
        status: 'watched',
      },
      {
        tmdbId: 1396,
        mediaType: 'tv',
        title: 'Breaking Bad',
        posterPath: '/ggJZtGnWZHkSvJyEKHLl2PwLcgw.jpg',
        status: 'watched',
      },
    ];

    for (const media of sampleMedia) {
      const existing = await prisma.mediaItem.findUnique({
        where: {
          userId_tmdbId_mediaType: {
            userId: adminUser.id,
            tmdbId: media.tmdbId,
            mediaType: media.mediaType,
          },
        },
      });

      if (!existing) {
        await prisma.mediaItem.create({
          data: {
            userId: adminUser.id,
            ...media,
          },
        });
      }
    }
    console.log('✅ Sample media items created/verified.');
  } else {
    console.log('ℹ️  Skipping sample media items (production environment).');
  }

  // ============================================
  // SECTION 4: USER STATISTICS
  // ============================================
  for (const user of createdUsers) {
    const existingStats = await prisma.userStats.findUnique({
      where: { userId: user.id },
    });

    if (!existingStats) {
      await prisma.userStats.create({
        data: {
          userId: user.id,
          totalMovies: 0,
          totalTvShows: 0,
          totalWatched: 0,
          totalWatching: 0,
          totalToWatch: 0,
        },
      });
    }
  }
  console.log('✅ User stats created/verified.');

  // ============================================
  // COMPLETION
  // ============================================
  console.log('\n🎉 Seed completed successfully!');
  await prisma.$disconnect();
}

main().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
