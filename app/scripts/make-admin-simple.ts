
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function makeAdmin() {
  // Replace this email with YOUR actual email address
  const ADMIN_EMAIL = "YOUR_ACTUAL_EMAIL_HERE"  // <-- CHANGE THIS TO YOUR EMAIL
  
  console.log('\n🔐 WAZ ADMIN SETUP - Grant Unlimited Free Access\n')
  console.log(`Looking for user with email: ${ADMIN_EMAIL}`)

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL }
    })

    if (!user) {
      console.log(`❌ User with email ${ADMIN_EMAIL} not found!`)
      console.log('💡 Steps to fix:')
      console.log('   1. Go to your live Vercel app')
      console.log('   2. Register an account with this email')
      console.log('   3. Update ADMIN_EMAIL in this script')
      console.log('   4. Run this script again')
      await prisma.$disconnect()
      return
    }

    // Make user admin with unlimited access
    const updatedUser = await prisma.user.update({
      where: { email: ADMIN_EMAIL },
      data: {
        isAdmin: true,
        planType: 'ADMIN',
        apiCallsLimit: 999999, // Unlimited
        planExpires: null // No expiration
      }
    })

    console.log('✅ SUCCESS! Admin privileges granted:')
    console.log(`   👤 User: ${updatedUser.firstName} ${updatedUser.lastName}`)
    console.log(`   📧 Email: ${updatedUser.email}`)
    console.log(`   🔑 Admin Status: ${updatedUser.isAdmin}`)
    console.log(`   🎯 Plan Type: ${updatedUser.planType}`)
    console.log(`   🚀 API Calls: UNLIMITED`)
    console.log('\n💰 You now have FREE unlimited access to your Waz platform!')
    console.log('🎉 No charges for your own usage - enjoy!')

  } catch (error) {
    console.error('❌ Error making admin:', error)
  }

  await prisma.$disconnect()
}

makeAdmin().catch(console.error)
