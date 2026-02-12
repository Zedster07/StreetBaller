// Placeholder seed file for development data
import prisma from '../config/database';

async function main() {
  console.log('🌱 Seeding database...');

  // Example: Create a test user and pitch
  // Uncomment and modify as needed during development
  
  /*
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      firebaseUid: 'test-uid-123',
      verifiedEmail: true,
    },
  });

  const pitch = await prisma.pitch.create({
    data: {
      name: 'Central Park Pitch',
      address: '123 Main St',
      city: 'New York',
      pitchType: 'Cage',
      surfaceType: 'Artificial',
      capacity: 22,
      isActive: true,
    },
  });

  console.log('✅ Seeded user:', user);
  console.log('✅ Seeded pitch:', pitch);
  */

  console.log('✅ Seeding complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
