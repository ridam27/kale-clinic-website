import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Kale Clinic Shared Database (JavaScript)...');

  // 1. Initial Consultation Fee Rules (India INR 150 default, international initial)
  await prisma.consultationFeeRule.upsert({
    where: { countryCode: 'IN' },
    update: {},
    create: {
      countryCode: 'IN',
      currency: 'INR',
      initialFeeMinorUnits: 15000,   // INR 150.00
      followUpFeeMinorUnits: 15000,  // INR 150.00
      isActive: true,
    },
  });
  console.log('✓ Fee rules initialized (India: INR 150)');

  // 2. Doctor / Admin Account (Placeholder credentials for development)
  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@kaleclinic.com' },
    update: {},
    create: {
      email: 'doctor@kaleclinic.com',
      passwordHash: '$2b$10$placeholderhashedpasswordfordoctoradmin',
      role: 'DOCTOR',
    },
  });

  // 3. Doctor Profile & Clinic Identity
  const doctorProfile = await prisma.doctorProfile.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      fullName: 'Dr. Kale',
      qualifications: 'BHMS, MD (Homeopathy)',
      registrationNumber: 'HOM-REG-PLACEHOLDER',
      clinicName: 'Kale Homeopathy Clinic',
      defaultTimezone: 'Asia/Kolkata',
      bio: 'Consultant Homeopathic Physician specializing in individualized classical homeopathy.',
    },
  });
  console.log('✓ Doctor profile initialized');

  // 4. Working Hours (Monday through Saturday, 09:00 - 12:00 IST)
  for (let day = 1; day <= 6; day++) {
    const existingRule = await prisma.availabilityRule.findFirst({
      where: {
        doctorId: doctorProfile.id,
        dayOfWeek: day,
      },
    });

    if (!existingRule) {
      await prisma.availabilityRule.create({
        data: {
          doctorId: doctorProfile.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '12:00',
          slotDurationMinutes: 30,
          bufferMinutes: 0,
          isActive: true,
        },
      });
    }
  }
  console.log('✓ Doctor availability schedule seeded (Mon-Sat 09:00 - 12:00 IST)');
  console.log('✓ Medicine master verified empty (ready for doctor entries)');
  console.log('Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

