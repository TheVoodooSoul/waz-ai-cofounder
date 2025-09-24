
import { PrismaClient } from '@prisma/client'
import * as readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function makeAdmin() {
  console.log('\n🔐 WAZ ADMIN SETUP - Grant Unlimited Free Access\n')
  
  rl.question('Enter your email address to make admin: ', async (email) => {
    if (!email) {
      console.log('❌ Email required!')
      rl.close()
      return
    }

    try {
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        console.log(`❌ User with email ${email} not found!`)
        console.log('💡 Please register an account first, then run this script.')
        rl.close()
        return
      }

      // Make user admin with unlimited access
      const updatedUser = await prisma.user.update({
        where: { email },
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
    rl.close()
  })
}

makeAdmin().catch(console.error)
