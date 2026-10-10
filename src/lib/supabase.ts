import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: async (input, init) => {
      const controller = new AbortController();
      const abort = () => controller.abort();
      const signal = init?.signal;
      if (signal?.aborted) controller.abort();
      signal?.addEventListener('abort', abort, { once: true });
      const timeout = window.setTimeout(abort, 12000);
      try { return await fetch(input, { ...init, signal: controller.signal }); }
      finally { window.clearTimeout(timeout); signal?.removeEventListener('abort', abort); }
    },
  },
})
