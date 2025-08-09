import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import type { Comment } from '~~/types/database.types'
export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = useSupabaseUser()
    const supabase = useSupabaseClient<Comment>()

    if (!user.value) {
        return navigateTo('/login')
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.value.id)
        .single()

    if (error || data?.role !== 'admin') {
        return navigateTo('/')
    }
})
