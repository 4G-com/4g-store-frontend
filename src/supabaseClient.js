import { createClient } from '@supabase/supabase-js'

// هذا الكود سيقرأ المتغيرات التي أضفتها في Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// إذا لم يجد المتغيرات (لأننا نعمل على الجهاز المحلي)، سيظهر خطأ واضح
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key are required.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
