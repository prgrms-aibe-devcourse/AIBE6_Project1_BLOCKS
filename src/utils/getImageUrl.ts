import { supabase } from "@/lib/supabase"

/* Storage 경로 → public URL 변환 */
export function getImageUrl(path: string) {
    const { data } = supabase.storage.from('festival').getPublicUrl(path)
    return data.publicUrl
}