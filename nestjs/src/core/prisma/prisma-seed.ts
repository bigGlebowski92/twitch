import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { BadRequestException, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/generated/client';
import { hash } from 'argon2';
import 'dotenv/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { createPgAdapter } from './create-pg-adapter';

const prisma = new PrismaClient({
  adapter: createPgAdapter(process.env.DATABASE_URL!),
});

const SEED_ASSETS_DIR = join(process.cwd(), 'src/core/prisma/seed-assets');

const S3_BUCKET = process.env.S3_BUCKET!;
const S3_PUBLIC_URL = process.env.S3_PUBLIC_URL!.replace(/\/$/, '');

const s3 = new S3Client({
  region: process.env.S3_REGION!,
  endpoint: process.env.S3_ENDPOINT!,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

async function ensureBucketExists(): Promise<void> {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: S3_BUCKET }));
  } catch {
    await s3.send(new CreateBucketCommand({ Bucket: S3_BUCKET }));
  }
}

async function uploadSeedAsset(key: string, filePath: string): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: readFileSync(filePath),
      ContentType: 'image/webp',
    }),
  );
  return `${S3_PUBLIC_URL}/${key}`;
}

const CATEGORIES = [
  {
    title: 'League of Legends',
    slug: 'league-of-legends',
    description:
      'A team-based strategy game where two teams of five champions face off to destroy the other’s base.',
  },
  {
    title: 'Fortnite',
    slug: 'fortnite',
    description:
      'A battle royale game where up to 100 players fight to be the last one standing.',
  },
  {
    title: 'VALORANT',
    slug: 'valorant',
    description:
      'A 5v5 character-based tactical shooter combining precise gunplay with unique agent abilities.',
  },
  {
    title: 'Minecraft',
    slug: 'minecraft',
    description:
      'A sandbox game about placing blocks and going on adventures in procedurally generated worlds.',
  },
  {
    title: 'Grand Theft Auto V',
    slug: 'grand-theft-auto-v',
    description:
      'An open-world action-adventure game set in the sprawling city of Los Santos.',
  },
  {
    title: 'Counter-Strike 2',
    slug: 'counter-strike-2',
    description:
      'A team-based tactical first-person shooter that pits terrorists against counter-terrorists.',
  },
  {
    title: 'Dota 2',
    slug: 'dota-2',
    description:
      'A multiplayer online battle arena game where two teams of five heroes fight to destroy the enemy Ancient.',
  },
  {
    title: 'Apex Legends',
    slug: 'apex-legends',
    description:
      'A free-to-play hero shooter battle royale featuring a roster of unique Legends with powerful abilities.',
  },
  {
    title: 'Call of Duty: Warzone',
    slug: 'call-of-duty-warzone',
    description:
      'A free-to-play battle royale entry in the Call of Duty franchise.',
  },
  {
    title: 'World of Warcraft',
    slug: 'world-of-warcraft',
    description:
      'A massively multiplayer online role-playing game set in the Warcraft fantasy universe.',
  },
  {
    title: 'Overwatch 2',
    slug: 'overwatch-2',
    description:
      'A team-based hero shooter where players choose from a diverse cast of heroes to battle it out.',
  },
  {
    title: 'PUBG: Battlegrounds',
    slug: 'pubg-battlegrounds',
    description:
      'A battle royale game where up to 100 players parachute onto an island to scavenge and fight for survival.',
  },
];

const AVATAR_FILES = [
  'avatar-1.webp',
  'avatar-2.webp',
  'avatar-3.webp',
  'avatar-4.webp',
  'avatar-5.webp',
  'avatar-6.webp',
];

const STREAM_TITLES: Record<string, string[]> = {
  'league-of-legends': [
    'Climbing to Challenger tonight',
    'Ranked grind with the boys',
    'Support main learning jungle',
    'Coaching session - ask me anything',
  ],
  fortnite: [
    'Grinding for that Victory Royale',
    'Zero Build only, no mercy',
    'Custom scrims with viewers',
    'New season, new drip',
  ],
  valorant: [
    'Radiant grind incoming',
    'Aim training + ranked',
    'Duo queue chaos',
    'Ace hunting all night',
  ],
  minecraft: [
    'Building a mega base from scratch',
    'Hardcore survival, one life only',
    'Speedrunning the Ender Dragon',
    'Modded Minecraft adventures',
  ],
  'grand-theft-auto-v': [
    'GTA5 in 100%',
    'Roleplay server shenanigans',
    'Heists with the crew',
    'Chaos mod is ON',
  ],
  'counter-strike-2': [
    'Faceit grind to Level 10',
    'Clutch or kick',
    'Aim practice + matchmaking',
    'Major watch party and ranked',
  ],
  'dota-2': [
    'Immortal rank grind',
    'One trick pony - only Invoker',
    'Pub stomping for fun',
    'Learning support role',
  ],
  'apex-legends': [
    'Chasing Predator rank',
    'Solo queue to Diamond',
    'Ranked arenas nonstop',
    'New legend, new tricks',
  ],
  'call-of-duty-warzone': [
    'Warzone wins only',
    'Solo vs squads challenge',
    'Sniper only challenge run',
    'Ranked resurgence grind',
  ],
  'world-of-warcraft': [
    'Mythic+ dungeon pushing',
    'Leveling a new alt from scratch',
    'Raid night with the guild',
    'Gold farming and market flipping',
  ],
  'overwatch-2': [
    'Tank diff every game',
    'One-trick support climb',
    'Ranked to Grandmaster',
    'Comp chaos with viewers',
  ],
  'pubg-battlegrounds': [
    'Chicken dinner hunting',
    'Solo squad wipes',
    'Ranked grind on Erangel',
    'ADS challenge - no walking',
  ],
};

const USERNAMES = [
  'ShadowStriker',
  'PixelQueen',
  'NightHawk99',
  'TurboToaster',
  'CrimsonFox',
  'GG_Wizard',
  'LunaPlays',
  'RogueSamurai',
  'ByteMeNow',
  'FrostbiteGaming',
  'NeonNomad',
  'ClutchKing',
  'VelvetThunder',
  'PixelPirate',
  'BlazeRunner',
  'GhostProtocol',
  'MysticMage',
  'IronCladGamer',
  'SkyWalker404',
  'ZenithZero',
];

async function main() {
  try {
    Logger.log('Seeding data...');
    await ensureBucketExists();

    await prisma.$transaction([
      prisma.user.deleteMany(),
      prisma.stream.deleteMany(),
      prisma.category.deleteMany(),
      prisma.socialLink.deleteMany(),
    ]);

    const categoriesWithThumbnails = await Promise.all(
      CATEGORIES.map(async (category) => ({
        ...category,
        thumbnailUrl: await uploadSeedAsset(
          `categories/${category.slug}.webp`,
          join(SEED_ASSETS_DIR, 'categories', `${category.slug}.webp`),
        ),
      })),
    );
    await prisma.category.createMany({ data: categoriesWithThumbnails });
    Logger.log('Categories seeded successfully');

    const avatarUrls = await Promise.all(
      AVATAR_FILES.map((file, index) =>
        uploadSeedAsset(
          `avatars/generic-${index + 1}.webp`,
          join(SEED_ASSETS_DIR, 'avatars', file),
        ),
      ),
    );

    const categories = await prisma.category.findMany();
    const categoriesBySlug = Object.fromEntries(
      categories.map((category) => [category.slug, category]),
    );

    await prisma.$transaction(async (tx) => {
      for (const username of USERNAMES) {
        const randomCategory =
          categoriesBySlug[
            Object.keys(categoriesBySlug)[
              Math.floor(Math.random() * Object.keys(categoriesBySlug).length)
            ]
          ];

        const userExists = await tx.user.findUnique({
          where: {
            username,
          },
        });

        if (!userExists) {
          const randomAvatarUrl =
            avatarUrls[Math.floor(Math.random() * avatarUrls.length)];

          const createdUser = await tx.user.create({
            data: {
              username,
              email: `${username}@example.com`,
              password: await hash('12345678'),
              displayName: username,
              avatar: randomAvatarUrl,
              bio: `Hey, I'm ${username}! Welcome to my channel.`,
              isEmailVerified: true,
              socialLinks: {
                createMany: {
                  data: [
                    {
                      title: 'Telegram',
                      url: `https://t.me/${username}`,
                      position: 1,
                    },
                    {
                      title: 'YouTube',
                      url: `https://www.youtube.com/@${username}`,
                      position: 2,
                    },
                  ],
                },
              },
            },
          });
          const randomStreamTitle = STREAM_TITLES[randomCategory.slug];
          const randomTitle =
            randomStreamTitle[
              Math.floor(Math.random() * randomStreamTitle.length)
            ];
          await tx.stream.create({
            data: {
              title: randomTitle,
              thumbnailUrl: randomCategory.thumbnailUrl,
              user: {
                connect: {
                  id: createdUser.id,
                },
              },
              category: {
                connect: {
                  id: randomCategory.id,
                },
              },
            },
          });
          Logger.log(`User ${username} created successfully`);
        }
      }
    });
    Logger.log('Data seeded successfully');
  } catch (error) {
    Logger.log('Error seeding data:', error);
    throw new BadRequestException('Error seeding data');
  } finally {
    Logger.log('Closing db connect');
    await prisma.$disconnect();
    Logger.log('Db connection closed');
  }
}

main().catch((error) => {
  Logger.error(error);
  process.exit(1);
});
