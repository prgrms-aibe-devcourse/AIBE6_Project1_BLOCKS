'use server'

export async function getAdminUuid() {
  return process.env.ADMIN_UUID || ''
}
